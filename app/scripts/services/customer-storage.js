'use strict';

angular.module('groupeat.services.customer-storage', [
  'LocalStorageModule',
  'ui.router'
])

.factory('CustomerStorage', function (localStorageService) {

  var
  setAddress = function(address) {
    if(address.residency) {
      localStorageService.set('residency', address.residency);
    }
    if(address.details) {
      localStorageService.set('details', address.details);
    }
  },

  setIdentity = function(identity) {
    if(identity.firstName) {
      localStorageService.set('firstName', identity.firstName);  
    }
    if(identity.lastName) {
      localStorageService.set('lastName', identity.lastName);
    }
    if(identity.phoneNumber) {
      localStorageService.set('phoneNumber', identity.phoneNumber);
    }
    if(identity.email) {
      localStorageService.set('email', identity.email);
    }
  },

  setSettings = function(settings) {
    if(settings.notificationsEnabled !== undefined) {
      localStorageService.set('notificationsEnabled', settings.notificationsEnabled);
    }
    if(settings.daysWithoutNotifying !== undefined) {
      localStorageService.set('daysWithoutNotifying', settings.daysWithoutNotifying);
    }
    if(settings.daysWithoutNotifying) {
      localStorageService.set('noNotificationAfter', settings.noNotificationAfter);
    }
  },

  reset = function () {
    localStorageService.remove('firstName');
    localStorageService.remove('lastName');
    localStorageService.remove('phoneNumber');
    localStorageService.remove('email');
    localStorageService.remove('residency');
    localStorageService.remove('details');
    localStorageService.remove('notificationsEnabled');
    localStorageService.remove('daysWithoutNotifying');
    localStorageService.remove('noNotificationAfter');
  },

  getAddress = function() {
    var address = {};
    address.residency = localStorageService.get('residency');
    address.details = localStorageService.get('details');
    return address;
  },

  getIdentity = function() {
    var identity = {};
    identity.firstName = localStorageService.get('firstName');
    identity.lastName = localStorageService.get('lastName');
    identity.phoneNumber = localStorageService.get('phoneNumber');
    identity.email = localStorageService.get('email');
    return identity;
  },

  getSettings = function() {
    var settings = {};
    settings.notificationsEnabled = ( localStorageService.get('notificationsEnabled') === 'true' );
    settings.daysWithoutNotifying = localStorageService.get('daysWithoutNotifying');
    settings.noNotificationAfter = localStorageService.get('noNotificationAfter');
    return settings;
  };

  return {
    setAddress: setAddress,
    setIdentity: setIdentity,
    setSettings: setSettings,
    reset: reset,
    getAddress: getAddress,
    getIdentity: getIdentity,
    getSettings: getSettings
  };

});
