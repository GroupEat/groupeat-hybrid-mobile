'use strict';

angular.module('groupeat.services.authentication', [
  'config',
  'LocalStorageModule',
  'ngResource',
  'groupeat.services.element-modifier'
])

.factory('Authentication',
function (localStorageService, $resource, $q, ENV, ElementModifier) {

  var
  tokenResource =  $resource(ENV.apiEndpoint+'/auth/token', null,
  {
    'getToken': { method: 'PUT' }
  }),
  resetPasswordResource =  $resource(ENV.apiEndpoint+'/auth/resetPassword', null,
  {
    'resetPassword': { method: 'POST' }
  });

  var /**
  * @ngdoc function
  * @name Authentication#setCredentials
  * @methodOf Authentication
  *
  * @description
  * Stores the customer credentials in local storage, and set the authorization HTTP headers
  *
  * @param {String} id - The customer id
  * @param {String} token - The customer user token
  */
  setCredentials = function (id, token) {
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
    {
      return undefined;
    }
    return {id: localStorageService.get('id'), token: localStorageService.get('token')};
  },
  /**

  * @ngdoc function
  * @name Authentication#getToken
  * @methodOf Authentication
  *
  * @description
  * Returns a promise for fetching the user token from the backend
  *
  * @param {} credentiels - A javascript object containing at least the email and password of the user
  */
  getToken = function(credentials) {
    var defer = $q.defer();
    tokenResource.getToken(null, credentials).$promise
    .then(function(response) {
      defer.resolve(response);
    })
    .catch(function(errorResponse) {
      defer.reject(ElementModifier.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  },

  resetPassword = function(credentials) {
    var defer = $q.defer();
    resetPasswordResource.resetPassword(null, credentials).$promise
    .then(function() {
      defer.resolve();
    })
    .catch(function(errorResponse) {
      defer.reject(ElementModifier.errorKeyFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    setCredentials: setCredentials,
    resetCredentials: resetCredentials,
    getCredentials: getCredentials,
    getToken: getToken,
    resetPassword: resetPassword
  };
}
);
