'use strict';

angular.module('groupeat.services.http-provider-interceptor', [
  'groupeat.services.credentials'
])

.factory('HttpProviderInterceptor', function($injector, Credentials) {
  var request = function(config) {
    config.headers.Accept = 'application/vnd.groupeat.v1+json';

    var credentials = Credentials.get();
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
