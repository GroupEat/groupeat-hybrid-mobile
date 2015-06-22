'use strict';

angular.module('groupeat.services.message-backdrop', [])

.factory('MessageBackdrop', [
  function() {

    var /**
    * @ngdoc function
    * @name MessageBackdrop#backdrop
    * @methodOf MessageBackdrop
    *
    * @description
    * Returns a message backdrop object
    *
    * @param {String} errorKey
    * @param {String} iconClasses
    * @param {String} buttonTitle
    * @param {String} buttonAction
    */
    backdrop = function(errorKey, iconClasses, buttonTitle, buttonAction) {
      return {
        show: true,
        title: errorKey+'Title',
        details: errorKey+'Details',
        iconClasses: iconClasses,
        button: {
          text: buttonTitle,
          action: buttonAction
        }
      };
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#backdropFromErrorKey
    * @methodOf MessageBackdrop
    *
    * @description
    * Returns the appropriate message backdrop or a generic failure default
    *
    * @param {String} errorKey
    */
    backdropFromErrorKey = function(errorKey) {
      var fn = this[errorKey];
      if (typeof fn === 'function') {
        return fn();
      }
      return genericFailure();
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noBackdrop
    * @methodOf MessageBackdrop
    *
    * @return Returns the appropriate message backdrop or a generic failure default
    *
    */
    noBackdrop = function() {
      return {
        show: false
      };
    },

    noNetwork = function() {
      return backdrop('noNetwork', 'ion-wifi', 'reload', 'onReload()');
    },

    noGeolocation = function() {
      return backdrop('noGeolocation', 'ion-wifi', 'reload', 'onReload()');
    },

    genericFailure = function() {
      return backdrop('genericFailure', 'ion-alert-circle', 'reload', 'onReload()');
    };

    return {
      backdrop: backdrop,
      backdropFromErrorKey: backdropFromErrorKey,
      noBackdrop: noBackdrop,
    };

  }
]);
