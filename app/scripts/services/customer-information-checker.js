'use strict';

angular.module('groupeat.services.customer-information-checker', [
  'groupeat.services.address',
  'groupeat.services.credentials',
  'groupeat.services.customer',
  'groupeat.services.customer-storage',
  'groupeat.services.lodash',
  'groupeat.services.popup',
  'ui.router'
])

.factory('CustomerInformationChecker', function (_, $filter, $q, $state, Address, Credentials, Customer, CustomerStorage, Popup) {

  var $translate = $filter('translate');

  var
  /**
  * @ngdoc function
  * @name CustomerInformationChecker#check
  * @methodOf CustomerInformationChecker
  *
  * @description Returns a promise informing wether or not the customer has already provided all needed information to order
  * It first checks the information from local storage to prevent making requests to the backend
  * if fulfilled, all required information were given
  * if rejected with a string, it will be a formatted string of missing properties (in the current locale)
  * and an confirm popup will be displayed, prompting the customer to reach the settings
  */
  check = function() {
    if (_.isEmpty(generateMissingProperties(CustomerStorage.getIdentity(), CustomerStorage.getAddress()))) {
      // Resolving if all information is available from local storage
      return $q.when({});
    } else {
      // Checking from the backend otherwise
      return checkFromBackend();
    }
  },

  /**
  * @ngdoc function
  * @name CustomerInformationChecker#checkFromBackend
  * @methodOf CustomerInformationChecker
  *
  * @description Returns a promise informing wether or not the customer has already provided all needed information to order
  * if fulfilled, all required information were given based on information from backend
  * if rejected with a string, it will be a formatted string of missing properties (in the current locale)
  * and an confirm popup will be displayed, prompting the customer to reach the settings
  */
  checkFromBackend = function () {
    var deferred = $q.defer();
    var customerId = Credentials.get().id;
    $q.all([Customer.get(customerId), Address.get(customerId)])
    .then(function(data) {
      // Resolved when both the customer identity and address were fetched
      var missingProperties = generateMissingProperties(data[0], data[1]);
      if (_.isEmpty(missingProperties)) {
        // Resolving when no properties are missing
        deferred.resolve();
      } else {
        var missingCustomerInformationMessage = generateCustomerInformationMessage(missingProperties);
        // Else showing a popup with the message highlighting the missing information
        Popup.confirm('missingProperties', missingCustomerInformationMessage, 'settings')
        .then(function(res) {
          if (res) {
            // Redirecting the customer to settings when asked
            $state.go('settings');
          }
          deferred.reject();
        });
      }
    });

    return deferred.promise;
  },

  /**
  * @ngdoc function
  * @name CustomerInformationChecker#generateCustomerInformationMessage
  * @methodOf CustomerInformationChecker
  *
  * @description Generates a human readable message highlighting which required information
  * were not yet provided by the user
  *
  * @todo : The string formatted relies heavily on the grammar and thus on the locale.
  * It will however probably work fine for most locales (French, English, Spanish...)
  */
  generateCustomerInformationMessage = function(missingProperties) {
    var missingPropertiesString = '';
    if (missingProperties.length === 1) {
      // Simply use the translated missing property
      missingPropertiesString = $translate(missingProperties[0]);
    } else if (missingProperties.length === 2) {
      // Seperate the two properties with an 'and'
      missingPropertiesString = $translate(missingProperties[0]) + ' ' + $translate('and') + ' ';
      missingPropertiesString += $translate(missingProperties[1]);
    } else {
      // Seperating all properties by a ',' except the two last by an 'and'
      var i;
      for (i = 0; i < missingProperties.length - 2; i++) {
        missingPropertiesString += $translate(missingProperties[i]) + ', ';
      }
      missingPropertiesString += $translate(missingProperties[missingProperties.length - 2]) + ' ' + $translate('and') + ' ';
      missingPropertiesString += $translate(missingProperties[missingProperties.length - 1]);
    }
    // Injecting the missingPropertiesString to get a full sentence
    return $translate('missingCustomerInformationMessage', {
      missingProperties: missingPropertiesString
    });
  },

  /**
  * @ngdoc function
  * @name CustomerInformationChecker#generateMissingProperties
  * @methodOf CustomerInformationChecker
  *
  * @description Generates an array of the missing information of the customer
  */
  generateMissingProperties = function(identity, address) {
    var mandatoryIdentityProperties = [
      'firstName',
      'lastName',
      'phoneNumber'
    ];
    var missingProperties = [];
    // Looping on identity properties to push missing ones
    _.forEach(mandatoryIdentityProperties, function (mandatoryProperty) {
      if (!_.has(identity, mandatoryProperty) || !identity[mandatoryProperty]) {
        missingProperties.push(mandatoryProperty);
      }
    });
    // Address is missing if it is has no provided residency
    if (!address || !address.residency) {
      missingProperties.push('address');
    }

    return missingProperties;
  };

  return {
    check: check
  };
});
