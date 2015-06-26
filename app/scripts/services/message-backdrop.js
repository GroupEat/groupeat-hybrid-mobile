'use strict';

angular.module('groupeat.services.message-backdrop', [])

.factory('MessageBackdrop', function($parse) {

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
      buttonTitle = buttonTitle || 'reload';
      buttonAction = buttonAction || 'onReload()';

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
      switch (errorKey) {
        case 'noNetwork':
          return noNetwork();
        case 'noGeolocation':
          return noGeolocation();
        default:
          return genericFailure();
      }
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noBackdrop
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop which will not be displayed
    *
    */
    noBackdrop = function() {
      return {
        show: false
      };
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noNetwork
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop for lack of network connectivity
    *
    */
    noNetwork = function() {
      return backdrop('noNetwork', 'ion-wifi');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noGeolocation
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop for lack of geolocation
    *
    */
    noGeolocation = function() {
      return backdrop('noGeolocation', 'ion-location');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#genericFailure
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop displaying a generic failure
    *
    */
    genericFailure = function() {
      return backdrop('genericFailure', 'ion-alert-circled');
    };

    return {
      backdrop: backdrop,
      backdropFromErrorKey: backdropFromErrorKey,
      noBackdrop: noBackdrop,
    };

  }
);
