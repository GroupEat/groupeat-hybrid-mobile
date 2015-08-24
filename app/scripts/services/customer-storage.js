'use strict';

angular.module('groupeat.services.customer-storage', [
  'LocalStorageModule'
])

.factory('CustomerStorage', function (localStorageService) {

  var
  setAddress = function(address) {
    if(address) {
      localStorageService.set('address', address);
    }
  },

  setIdentity = function(identity) {
    if(identity) {
      localStorageService.set('identity', identity);
    }
  },

  setSettings = function(settings) {
    if(settings) {
      localStorageService.set('settings', settings);
    }
  },

  setDefaultSettings = function() {
    var settings = {
      'notificationsEnabled' : 'true',
      'daysWithoutNotifying': '2',
      'noNotificationAfter': '23:00:00' 
    };
    localStorageService.set('settings', settings);
  },

  reset = function () {
    localStorageService.remove('settings');
    localStorageService.remove('identity');
    localStorageService.remove('settings');
  },

  getAddress = function() {
    return localStorageService.get('address') || {};
  },

  getIdentity = function() {
    return localStorageService.get('identity') || {};
  },

  getSettings = function() {
    var settings = localStorageService.get('settings');
    settings.notificationsEnabled = (settings.notificationsEnabled === 'true');
    return settings || {};
  };

  return {
    setAddress: setAddress,
    setIdentity: setIdentity,
    setSettings: setSettings,
    setDefaultSettings: setDefaultSettings,
    reset: reset,
    getAddress: getAddress,
    getIdentity: getIdentity,
    getSettings: getSettings
  };

});
