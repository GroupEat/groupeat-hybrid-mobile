'use strict';

angular.module('groupeat.services.address', [
  'config',
  'ngResource',
  'pascalprecht.translate'
])

.factory('Address', function($resource, $q, ENV, $filter) {

  var $translate = $filter('translate');

  var resource = $resource(ENV.apiEndpoint+'/customers/:id/address', null,
  {
    'update': { method: 'PUT' },
    'getAddress': { method: 'GET'}
  });

  var
  update = function(parameters, requestBody) {
    var defer = $q.defer();
    resource.update(parameters, requestBody).$promise
    .then(function() {
      defer.resolve();
    })
    .catch(function() {
      defer.reject($translate('invalidAddressErrorKey'));
    });
    return defer.promise;
  },

  getAddress = function(parameters) {
    var defer = $q.defer();
    resource.get(parameters).$promise
    .then(function() {
      defer.resolve();
    })
    .catch(function() {
      defer.reject($translate('unableToAccessAddress'));
    });
    return defer.promise;
  },

  getAddressFromResidencyInformation = function() {
    var street, latitude, longitude;
    street = 'Boulevard des Maréchaux';
    latitude = 48.7107339;
    longitude = 2.218232700000044;
    return {
      street: street,
      latitude: latitude,
      longitude: longitude
    };
  };

  return {
    update: update,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation,
    getAddress: getAddress
  };
});
