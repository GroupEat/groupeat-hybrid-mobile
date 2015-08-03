'use strict';

angular.module('groupeat.services.credentials',
  ['LocalStorageModule']
)

.factory('Credentials', function (localStorageService, $state) {

  var
  /**
  * @ngdoc function
  * @name Credentials#setCredentials
  * @methodOf Credentials
  *
  * @description
  * Stores the customer credentials in local storage, and set the authorization HTTP headers
  *
  * @param {String} id - The customer id
  * @param {String} token - The customer user token
  */
  set = function (id, token) {
    localStorageService.set('id', id);
    localStorageService.set('token', token);
  },

  /**
  * @ngdoc function
  * @name Credentials#reset
  * @methodOf Credentials
  *
  * @description
  * Resets the customer credentials and removes the authorization HTTP header
  *
  */
  reset = function () {
    localStorageService.remove('id');
    localStorageService.remove('token');
  },

  /**
  * @ngdoc function
  * @name Credentials#get
  * @methodOf Credentials
  *
  * @description
  * Fetches the current customer credentials
  *
  */
  get = function () {
    if (!localStorageService.get('id') || !localStorageService.get('token')) {
      $state.go('authentication');
    }
    return {
      id: localStorageService.get('id'),
      token: localStorageService.get('token')
    };
  };

  return {
    set: set,
    reset: reset,
    get: get
  };

});
