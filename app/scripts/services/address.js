'use strict';

angular.module('groupeat.services.address', ['ngResource', 'config'])

.factory('Address', function($resource, ENV) {

  var resource = $resource(ENV.apiEndpoint+'/customers/:id/address', null,
{
    'update': { method: 'PUT' }
  }),

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
    resource: resource,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation
  };
});
