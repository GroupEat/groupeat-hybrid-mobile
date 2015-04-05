'use strict';

angular.module('groupeat.services.address', [
  'config',
  'groupeat.services.backend-utils',
  'ngResource',
  'pascalprecht.translate'
])

.factory('Address', function($filter, $resource, $q, BackendUtils, ENV) {

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
    var deferred = $q.defer();
    resource.get({id: userId}).$promise
    .then(function(response) {
      deferred.resolve(response.data);
    })
    .catch(function(errorResponse) {
      var errorKey = BackendUtils.errorKeyFromBackend(errorResponse);
      if (errorKey === 'noAddressForThisCustomer')
      {
        deferred.resolve();
      }
      else
      {
        deferred.reject();
      }
    });
    return deferred.promise;
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
    else
    {
      street = 'Boulevard des Maréchaux';
      latitude = 48.7107339;
      longitude = 2.218232700000044;
    }
    return {
        street: street,
        latitude: latitude,
        longitude: longitude
      };
  },

  getResidencyInformationFromAddress = function(address) {
    if (address.latitude === 48.709862 && address.longitude === 2.210241)
    {
      return 'polytechnique';
    }
    else if (address.latitude === 48.714258 && address.longitude === 2.203553)
    {
      return 'supoptique';
    }
    else
    {
      return 'ENSTAParisTech';
    }
  },

  getResidencies = function() {
    return ['ENSTAParisTech', 'polytechnique', 'supoptique'] ;
  };

  return {
    get: get,
    update: update,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation,
    getResidencyInformationFromAddress: getResidencyInformationFromAddress,
    getResidencies: getResidencies
  };
});
