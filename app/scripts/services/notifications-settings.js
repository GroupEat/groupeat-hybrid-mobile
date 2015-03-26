'use strict';

angular.module('groupeat.services.notifications-settings', [])

.factory('NotificationsSettings', function() {

  var
  getNoNotificationAfterHours = function() {
    return ['21h00', '22h00', '23h00', '00h00', '01h00'];
  },

  getDaysWithoutNotifying = function() {
    return [0, 1, 2, 3, 4, 5, 6, 7];
  };

  return {
    getNoNotificationAfterHours : getNoNotificationAfterHours,
    getDaysWithoutNotifying : getDaysWithoutNotifying
  };
});
