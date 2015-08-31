'use strict';

angular.module('groupeat.services.address', [
  'constants',
  'groupeat.services.backend-utils',
  'groupeat.services.lodash',
  'ngResource',
  'pascalprecht.translate'
])

.factory('Address', function (_, $filter, $resource, $q, BackendUtils, ENV) {

  var $translate = $filter('translate');
  var resource = $resource(ENV.apiEndpoint + '/customers/:id/address', null, { 'update': { method: 'PUT' } });

  var residencies = [
    {
      name: 'ENSTAParisTech',
      street: 'Résidence ENSTA ParisTech, 828 Boulevard des Maréchaux',
      latitude: 48.7107339,
      longitude: 2.2182327
    },
    {
      name: 'joffre',
      street: 'Résidence Joffre (Polytechnique), 11 Boulevard des Maréchaux',
      latitude: 48.711109,
      longitude: 2.210736
    },
    {
      name: 'fayolle',
      street: 'Résidence Fayolle (Polytechnique), 11 Boulevard des Maréchaux',
      latitude: 48.711109,
      longitude: 2.210736
    },
    {
      name: 'foche',
      street: 'Résidence Foche (Polytechnique), 11 Boulevard des Maréchaux',
      latitude: 48.711109,
      longitude: 2.210736
    },
    {
      name: 'manoury',
      street: 'Résidence Manoury (Polytechnique), 11 Boulevard des Maréchaux',
      latitude: 48.711109,
      longitude: 2.210736
    },
    {
      name: 'lemonnier',
      street: 'Résidence Lemonnier (Polytechnique), 76 Boulevard des Maréchaux',
      latitude: 48.710476,
      longitude: 2.213126
    },
    {
      name: 'schaeffer',
      street: 'Résidence Schaeffer (Polytechnique), 79 Boulevard des Maréchaux',
      latitude: 48.710169,
      longitude: 2.214365
    }
  ];

  /**
  * @ngdoc function
  * @name Address#update
  * @methodOf Address
  *
  * @description
  * Patches a customer address and returns a promise
  * if rejected, an error message in proper locale will be rejected
  * https://groupeat.fr/docs
  *
  * @param {String} customerId the id of the customer to update
  * @param {Object} requestBody the fields to update for the customer
  */
  var update = function (customerId, requestBody) {
    var deferred = $q.defer();
    resource.update({id: customerId}, requestBody).$promise
    .then(function (response) {
      deferred.resolve({
        'residency': getResidencyInformationFromAddress(response.data),
        'details': response.data.details
      });
    })
    .catch(function () {
      deferred.reject($translate('invalidAddressErrorKey'));
    });
    return deferred.promise;
  },

  /**
  * @ngdoc function
  * @name Address#get
  * @methodOf Address
  *
  * @description
  * Fetches a customer address
  * https://groupeat.fr/docs
  *
  * @param {String} customerId the id of the customer to update
  */
  get = function (userId) {
    var deferred = $q.defer();
    resource.get({ id: userId }).$promise
    .then(function (response) {
      var address = response.data;
      if (address) {
        var residency = getResidencyInformationFromAddress(address);
        deferred.resolve({
          'residency': residency,
          'details': address.details
        });
      } else {
        deferred.resolve();
      }
    })
    .catch(function (errorResponse) {
      var errorKey = BackendUtils.errorKeyFromBackend(errorResponse);
      if (errorKey === 'noAddressForThisCustomer') {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    });
    return deferred.promise;
  },

  getAddressFromResidencyInformation = function (residency) {
    var address = _.chain(residencies).find('name', residency).omit('name').value();
    return _.isEmpty(address) ? undefined : address;
  },

  getResidencyInformationFromAddress = function (address) {
    var residency = _.find(residencies, 'street', address.street);
    return residency ? residency.name : undefined;
  },

  getResidencies = function() {
    return _.pluck(residencies, 'name');
  };

  return {
    get: get,
    update: update,
    getAddressFromResidencyInformation: getAddressFromResidencyInformation,
    getResidencies: getResidencies,
    getResidencyInformationFromAddress: getResidencyInformationFromAddress
  };
});
