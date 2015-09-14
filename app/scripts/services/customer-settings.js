'use strict';
angular.module('groupeat.services.customer-settings', [
  'constants',
  'groupeat.services.backend-utils',
  'groupeat.services.lodash',
  'ngResource'
]).factory('CustomerSettings', function ($resource, $q, BackendUtils, ENV, _) {
  var resource = $resource(ENV.apiEndpoint + '/customers/:id/settings', null, { 'update': { method: 'PUT' } });
  var noNotificationAfterHours = [
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

  var getNoNotificationAfterHours = function () {
    return _.pluck(noNotificationAfterHours, 'value');

  },

  getDaysWithoutNotifying = function () {
    return [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7
    ];
  },

  getLabelHourFromValue = function(value) {
    return _.find(noNotificationAfterHours, 'value', value).label;
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
  get = function (customerId) {
    var defer = $q.defer();
    resource.get({ id: customerId }).$promise.then(function (response) {
      defer.resolve(response.data);
    }).catch(function () {
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
  update = function (customerId, customerSettings) {
    var defer = $q.defer();
    resource.update({ id: customerId }, customerSettings).$promise.then(function (response) {
      defer.resolve(response.data);
    }).catch(function (errorResponse) {
      defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
    });
    return defer.promise;
  };
  return {
    getNoNotificationAfterHours: getNoNotificationAfterHours,
    getDaysWithoutNotifying: getDaysWithoutNotifying,
    get: get,
    getLabelHourFromValue: getLabelHourFromValue,
    update: update
  };
});
