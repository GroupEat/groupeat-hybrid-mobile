'use strict';

angular.module('groupeat.services.customer', [
  'config',
  'ngResource',
  'groupeat.services.element-modifier'
])

.factory('Customer', function($resource, $q, ENV, ElementModifier) {

  var resource = $resource(ENV.apiEndpoint+'/customers/:id', null,
  {
    'update': { method: 'PATCH' }
  });

  var
  get = function() {
    return resource.get();
  },
  
  save = function(requestBody) {
    var defer = $q.defer();
    resource.save(null, requestBody).$promise
    .then(function(response) {
      defer.resolve(response);
    })
    .catch(function(errorResponse) {
      defer.reject(ElementModifier.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  },

  update = function(parameters, requestBody) {
    var defer = $q.defer();
    resource.update(parameters, requestBody).$promise
    .then(function() {
      defer.resolve();
    })
    .catch(function(errorResponse) {
      defer.reject(ElementModifier.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    get: get,
    save: save,
    update: update,
  };
});
