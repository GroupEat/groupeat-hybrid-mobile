'use strict';

angular.module('groupeat.services.customer', [
  'groupeat.services.address',
  'groupeat.services.backend-utils',
  'groupeat.services.credentials',
  'groupeat.services.lodash'
])

.factory('Customer', function($filter, $resource, $q, ENV, _, Address, BackendUtils, Credentials) {

  var $translate = $filter('translate');

  var resource = $resource(ENV.apiEndpoint+'/customers/:id', null,
  {
    'update': { method: 'PUT' }
  });

  var /**
  * @ngdoc function
  * @name Customer#get
  * @methodOf Customer
  *
  * @description
  * Returns a promise
  * If fulfilled, will have customer information
  * https://groupeat.fr/docs
  *
  * @param {String} customerId - The id of the customer
  */
  get = function(customerId) {
    var defer = $q.defer();
    resource.get({id: customerId}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name Customer#save
  * @methodOf Customer
  *
  * @description
  * Registers a new customer and returns a promise
  * if fulfilled, will have the id and the token of the customer
  * if rejected, an error message in proper locale will be rejected
  * https://groupeat.fr/docs
  *
  * @param {Object} requestBody - must contain an 'email' and 'password' field
  */
  save = function(requestBody) {
    var defer = $q.defer();
    resource.save(null, requestBody).$promise
    .then(function(response) {
      defer.resolve(response);
    })
    .catch(function(errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name Customer#update
  * @methodOf Customer
  *
  * @description
  * Patches a customer and returns a promise
  * if rejected, an error message in proper locale will be rejected
  * https://groupeat.fr/docs
  *
  * @param {Object} parameters an object containing an 'id' field of the customer to update
  * @param {Object} requestBody the fields to update for the customer
  */
  update = function(parameters, requestBody) {
    var defer = $q.defer();
    resource.update(parameters, requestBody).$promise
    .then(function() {
      defer.resolve();
    })
    .catch(function(errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name Customer#checkMissingInformation
  * @methodOf Customer
  *
  * @description Returns a promise informing wether or not the customer has already provided all needed information to order
  * if fulfilled, all required information were given
  * if rejected with a string, it will be a formatted string of missing properties (in the current locale)
  * it will also be rejected (with nothing) if an error was encountered along the way
  *
  * @todo : The string formatted relies heavily on the grammar and thus on the locale.
  * It will however probably work fine for most locales (French, English, Spanish...)
  *
  */
  checkMissingInformation = function() {
    var deferred = $q.defer();
    var customerId = Credentials.get().id;
    var mandatoryCustomerProperties = ['firstName', 'lastName', 'phoneNumber'];
    var missingProperties = [];
    get(customerId)
    .then(function(customer) {
      _.forEach(mandatoryCustomerProperties, function(mandatoryProperty) {
        if (!_.has(customer, mandatoryProperty) || !customer[mandatoryProperty])
        {
          missingProperties.push(mandatoryProperty);
        }
      });
      Address.get(customerId)
      .catch(function() {
        missingProperties.push('address');
      })
      .finally(function() {
        if (_.isEmpty(missingProperties))
        {
          deferred.resolve();
        }
        else
        {
          var missingPropertiesString = '';
          if (missingProperties.length === 1)
          {
            missingPropertiesString = $translate(missingProperties[0]);
          }
          else if (missingProperties.length === 2)
          {
            missingPropertiesString = $translate(missingProperties[0]) + ' ' + $translate('and') + ' ';
            missingPropertiesString += $translate(missingProperties[1]);
          }
          else
          {
            var i;
            for (i = 0; i < missingProperties.length-2; i++)
            {
              missingPropertiesString += $translate(missingProperties[i]) + ', ';
            }
            missingPropertiesString += $translate(missingProperties[missingProperties.length-2]) + ' ' + $translate('and') + ' ';
            missingPropertiesString += $translate(missingProperties[missingProperties.length-1]);
          }
          deferred.reject(missingPropertiesString);
        }
      });
    })
    .catch(function() {
      deferred.reject();
    });
    return deferred.promise;
  };

  return {
    get: get,
    save: save,
    update: update,
    checkMissingInformation: checkMissingInformation
  };
});
