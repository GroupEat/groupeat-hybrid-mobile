'use strict';

angular.module('groupeat.services.address', [
  'constants',
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
    var deferred = $q.defer();
    resource.update(parameters, requestBody).$promise
    .then(function(response) {
      deferred.resolve({'residency': getResidencyInformationFromAddress(response.data), 'details': response.data.details});
    })
    .catch(function() {
      deferred.reject($translate('invalidAddressErrorKey'));
    });
    return deferred.promise;
  },

  get = function(userId) {
    var deferred = $q.defer();
    resource.get({id: userId}).$promise
    .then(function(response) {
      var address = response.data;
      if (address)
			{
				var residency = getResidencyInformationFromAddress(address);
				deferred.resolve({'residency': residency, 'details': address.details});
			}
      else
      {
        deferred.resolve();
      }
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
    else if (residency === 'ENSTAParisTech')
    {
      street = 'Boulevard des Maréchaux';
      latitude = 48.7107339;
      longitude = 2.2182327;
    }
    else
    {
      return undefined;
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
    else if (address.latitude === 48.7107339 && address.longitude === 2.2182327)
    {
      return 'ENSTAParisTech';
    }
    return undefined;
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
