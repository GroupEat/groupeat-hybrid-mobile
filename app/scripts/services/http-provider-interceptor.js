'use strict';

angular.module('groupeat.services.http-provider-interceptor', [
  'groupeat.services.lodash',
  'groupeat.services.credentials'
])

.factory('HttpProviderInterceptor', function ($injector, $q, _) {

  var request = function (config) {
    if (config.url.indexOf('groupeat') !== -1) {
      config.headers.Accept = 'application/vnd.groupeat.v1+json';
      var credentials = $injector.get('Credentials').get(false);
      if (credentials && credentials.token) {
        config.headers.Authorization = 'bearer ' + credentials.token;
      }
    }
    return config;
  },

  responseError = function(response) {
    var keysRequiringRedirection = ['userMustAuthenticate', 'invalidAuthenticationTokenSignature', 'noUserForAuthenticationToken'];
    if (response.status === 401 && _.has(response, 'data.data.errorKey') && _.includes(keysRequiringRedirection, response.data.data.errorKey)) {
      $injector.get('$state').go('authentication');
    }
    return $q.reject(response);
  };

  return {
    request: request,
    responseError: responseError
  };
});
