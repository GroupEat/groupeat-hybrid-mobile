'use strict';

angular.module('groupeat.services.customer', [
  'constants',
  'groupeat.services.backend-utils',
  'groupeat.services.credentials',
  'groupeat.services.popup',
  'LocalStorageModule',
  'ngResource',
  'ui.router'
])

.factory('Customer', function ($q, $resource, $state, BackendUtils, Credentials, ENV, localStorageService, Popup) {

  var resource = $resource(ENV.apiEndpoint + '/customers/:id', null, { 'update': { method: 'PUT' } });

  var removeInternationalPrefixFromPhoneNumber = function(customer) {
    if (customer && customer.phoneNumber && customer.phoneNumber.length > 10) {
      customer.phoneNumber = customer.phoneNumber.substring(2);
    }

    return customer;
  };

  var addFrenchPrefixToPhoneNumber = function(customer) {
    if (customer && customer.phoneNumber && customer.phoneNumber.substring(0, 2) !== '33') {
      customer.phoneNumber = '33' + customer.phoneNumber;
    }

    return customer;
  };

  var
    /**
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
      defer.resolve(removeInternationalPrefixFromPhoneNumber(response.data));
    })
    .catch(function(errorResponse) {
      if (errorResponse.status === 404) {
        $state.go('authentication');
      }
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
  save = function (requestBody) {
    var defer = $q.defer();
    resource.save(null, requestBody).$promise
    .then(function (response) {
      defer.resolve(removeInternationalPrefixFromPhoneNumber(response.data));
    })
    .catch(function (errorResponse) {
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
  * @param {String} customerId the id of the customer to update
  * @param {Object} requestBody the fields to update for the customer
  */
  update = function (customerId, requestBody) {
    var defer = $q.defer();
    resource.update({id: customerId}, addFrenchPrefixToPhoneNumber(requestBody)).$promise
    .then(function (response) {
      defer.resolve(removeInternationalPrefixFromPhoneNumber(response.data));
    })
    .catch(function (errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name Customer#checkActivatedAccount
  * @methodOf Customer
  *
  * @description Returns a promise informing wether or not the customer has already activated his/her account
  */
  checkActivatedAccount = function() {
    var deferred = $q.defer();
    if (localStorageService.get('activatedAccount') === 'true') {
      deferred.resolve();
    }
    else {
      var customerId = Credentials.get().id;
      get(customerId)
      .then(function(customer) {
        if (!customer.activated)
        {
          deferred.reject();
          Popup.error('nonActivatedAccountDetails');
        }
        else
        {
          localStorageService.set('activatedAccount', true);
          deferred.resolve();
        }
      });
    }

    return deferred.promise;
  };

  return {
    get: get,
    save: save,
    update: update,
    checkActivatedAccount: checkActivatedAccount,
  };
});
