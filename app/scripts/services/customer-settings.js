'use strict';

angular.module('groupeat.services.customer-settings', [
  'config',
  'groupeat.services.backend-utils',
  'ngResource'
])

.factory('CustomerSettings', function($resource, $q, BackendUtils, ENV) {

  var resource = $resource(ENV.apiEndpoint+'/customers/:id/settings', null,
  {
    'update': { method: 'PUT'}
  });

  var
  getNoNotificationAfterHours = function() {
    return [
      {
        value: '21:00:00',
        label: '21h00'
      },
      {
        value: '22:00:00',
        label: '22h00'
      },
      {
        value: '23:00:00',
        label: '23h00'
      },
      {
        value: '00:00:00',
        label: '00h00'
      },
      {
        value: '01:00:00',
        label: '01h00'
      }
    ];
  },

  getDaysWithoutNotifying = function() {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  },

  /**
  * @ngdoc function
  * @name CustomerSettings#get
  * @methodOf CustomerSettings
  *
  * @description
  * Returns a promise which, if resolved includes the list of customer settings
  * https://groupeat.fr/docs
  *
  */
  get = function(customerId) {
    var defer = $q.defer();
    resource.get({id: customerId}).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  },

  /**
  * @ngdoc function
  * @name CustomerSettings#update
  * @methodOf CustomerSettings
  *
  * @description
  * Returns a promise which, if resolved includes the list of customer settings
  * https://groupeat.fr/docs
  *
  */
  update = function(customerId, customerSettings) {
    var defer = $q.defer();
    resource.update({id: customerId}, customerSettings).$promise
    .then(function(response) {
      defer.resolve(response.data);
    })
    .catch(function(errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  };

  return {
    getNoNotificationAfterHours : getNoNotificationAfterHours,
    getDaysWithoutNotifying : getDaysWithoutNotifying,
    get: get,
    update: update
  };
});
