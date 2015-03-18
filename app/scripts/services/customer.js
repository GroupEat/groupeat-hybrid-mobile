'use strict';

angular.module('groupeat.services.customer', ['groupeat.services.backend-utils'])

.factory('Customer', function($resource, $q, ENV, BackendUtils) {

  var resource = $resource(ENV.apiEndpoint+'/customers/:id', null,
  {
    'update': { method: 'PUT' }
  });

  var /**
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
  };

  return {
    save: save,
    update: update,
  };
});
