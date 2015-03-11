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
    return resource.get(parameters);
  },

  getAddressFromResidencyInformation = function(residency) {
    var street, latitude, longitude;
    if(residency === 'ENSTAParisTech')
    {
      street = 'Boulevard des Maréchaux';
      latitude = 48.7107339;
      longitude = 2.218232700000044;
    }
    else if (residency === 'polytechnique')
    {
      street = 'Boulevard des Maréchaux';
      latitude = 48.709862;
      longitude = 2.210241;
    }
    else if (residency === 'supoptique')
    {
      street = '2 Avenue Augustin Fresnel';
      latitude = 48.714258;
      longitude = 2.203553;
    }
    else
    {
      return false;
    }
    return {
        street: street,
        latitude: latitude,
        longitude: longitude
      };
  },

  getResidencies = function() {
    return ['ENSTAParisTech', 'polytechnique', 'supoptique'] ;
  };

  return {
    update: update,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation,
    getAddress: getAddress,
    getResidencies: getResidencies
  };
});
