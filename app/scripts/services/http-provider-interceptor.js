'use strict';

angular.module('groupeat.services.http-provider-interceptor', ['groupeat.services.authentication'])

.factory('HttpProviderInterceptor', function($injector) {
  var request = function(config) {
    config.headers.Accept = 'application/vnd.groupeat.v1+json';

    var Authentication = $injector.get('Authentication');
    var credentials = Authentication.getCredentials();
    if (credentials && credentials.token)
    {
      config.headers.Authorization = 'bearer ' + credentials.token;
    }
    return config;
  };
  return {
    request: request
  };
});
