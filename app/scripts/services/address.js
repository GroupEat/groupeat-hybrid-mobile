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
    'update': { method: 'PUT' }
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

  get = function(userId) {
    var defer = $q.defer();
    resource.get({id: userId}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  },

  getResidencyFromGeolocation = function(latitude, longitude) {
    console.log(latitude + ', ' + longitude);
    var response = null;
    if(latitude === 48.709862 && longitude === 2.210241) {
      response = 'polytechnique';
    }
    else if (latitude === 48.714258 && longitude === 2.203553) {
      response = 'supoptique';
    }
    else if (latitude === 48.7107339 && longitude === 2.2182327) {
      response = 'ENSTAParisTech';
    }
    return response;
  },

  getAddressFromResidencyInformation = function(residency) {
    var street, latitude, longitude = null;
    if (residency === 'polytechnique')
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
    else if (residency === 'ENSTAParisTech')
    {
      street = 'Boulevard des Maréchaux';
      latitude = 48.7107339;
      longitude = 2.2182327;
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
    get: get,
    update: update,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation,
    getResidencyFromGeolocation: getResidencyFromGeolocation,
    getResidencies: getResidencies
  };
});
