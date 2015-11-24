'use strict';

angular.module('groupeat.services.credentials', [
  'LocalStorageModule',
  'ui.router'
])

.factory('Credentials', function ($state, localStorageService) {

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
  * @param {Boolean} redirect - Should the function redirect to the authentication state if the credentials information are not defined
  *                             Default value is true
  *
  */
  get = function (redirect) {
    redirect = redirect !== false;
    if (!localStorageService.get('id') || !localStorageService.get('token')) {
      if (redirect) {
        $state.go('app.authentication');
      }
      return undefined;
    }
    return {
      id: localStorageService.get('id'),
      token: localStorageService.get('token')
    };
  },

  isAuthenticated = function () {
    return !!localStorageService.get('token');
  };

  return {
    set: set,
    reset: reset,
    get: get,
    isAuthenticated: isAuthenticated
  };

});
