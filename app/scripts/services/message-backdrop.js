'use strict';

angular.module('groupeat.services.message-backdrop', [])

.factory('MessageBackdrop', function() {

    var /**
    * @ngdoc function
    * @name MessageBackdrop#backdrop
    * @methodOf MessageBackdrop
    *
    * @description
    * Returns a message backdrop object
    *
    * @param {String} errorKey
    * @param {String} icon
    * @param {String} buttonText
    * @param {String} buttonSref
    */
    backdrop = function(errorKey, icon, buttonText, buttonSref) {
      buttonText = buttonText || 'reload';
      buttonSref = buttonSref || '';

      return {
        status: 'displayed',
        title: errorKey,
        details: errorKey+'Details',
        icon: icon,
        buttonText: buttonText,
        buttonSref: buttonSref
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
        case 'noGroupOrders':
          return noGroupOrders();
        case 'noRestaurants':
          return noRestaurants();
        case 'noOrders':
          return noOrders();
        case 'emptyMenu':
          return emptyMenu();
        default:
          return genericFailure();
      }
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noNetwork
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop object for lack of network connectivity
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
    * @return Returns a message backdrop object for lack of geolocation
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
    * @return Returns a message backdrop object displaying a generic failure
    *
    */
    genericFailure = function() {
      return backdrop('genericFailure', 'ion-alert-circled');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noGroupOrders
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop object for lack of group orders
    *
    */
    noGroupOrders = function() {
      return backdrop('noGroupOrders', 'ion-ios-cart-outline', 'newOrder', 'app.restaurants');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noRestaurants
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop object for lack of restaurants
    *
    */
    noRestaurants = function() {
      return backdrop('noRestaurants', 'ion-android-restaurant');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#noOrders
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop object for lack of orders
    *
    */
    noOrders = function() {
      return backdrop('noOrders', 'ion-thumbsdown');
    },

    /**
    * @ngdoc function
    * @name MessageBackdrop#emptyMenu
    * @methodOf MessageBackdrop
    *
    * @return Returns a message backdrop object for an empty menu
    *
    */
    emptyMenu = function() {
      return backdrop('emptyMenu', 'ion-android-pizza');
    };

    return {
      backdropFromErrorKey: backdropFromErrorKey
    };

  }
);
