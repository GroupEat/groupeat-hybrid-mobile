'use strict';

angular.module('groupeat.services.authentication', ['groupeat.services.backend-utils'])

.factory('Authentication',
function ($resource, $q, ENV, BackendUtils) {

  var
  tokenResource = $resource(ENV.apiEndpoint+'/auth/token', null,
  {
    'getToken': { method: 'PUT' }
  }),
  resetPasswordResource = $resource(ENV.apiEndpoint+'/auth/password', null,
  {
    'resetPassword': { method: 'DELETE' }
  });

  var
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
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
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
      defer.reject(BackendUtils.errorKeyFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    getToken: getToken,
    resetPassword: resetPassword
  };
}
);
