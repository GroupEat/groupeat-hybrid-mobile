'use strict';

angular.module('groupeat.services.authentication', [])

.factory('Authentication',
function (localStorageService) {
  var /**
  * @ngdoc function
  * @name Authentication#setCredentials
  * @methodOf Authentication
  *
  * @description
  * Stores the customer credentials in local storage, and set the authorization HTTP headers
  *
  * @param {Integer} id - The customer id
  * @param {String} token - The customer user token
  */
  setCredentials = function (id, token) {
    if (id !== parseInt(id, 10))
      throw new Error('The customer id is not an integer');
    localStorageService.set('id', id);
    localStorageService.set('token', token);
  },

  /**
  * @ngdoc function
  * @name Authentication#resetCredentials
  * @methodOf Authentication
  *
  * @description
  * Resets the customer credentials and removes the authorization HTTP header
  *
  */
  resetCredentials = function() {
    localStorageService.remove('id');
    localStorageService.remove('token');
  },

  /**
  * @ngdoc function
  * @name Authentication#getCredentials
  * @methodOf Authentication
  *
  * @description
  * Fetches the current customer credentials
  *
  */
  getCredentials = function() {
    if (!localStorageService.get('id') || !localStorageService.get('token'))
      return undefined
    return {id: localStorageService.get('id'), token: localStorageService.get('token')};
  };

  return {
    setCredentials: setCredentials,
    resetCredentials: resetCredentials,
    getCredentials: getCredentials
  };
}
);
