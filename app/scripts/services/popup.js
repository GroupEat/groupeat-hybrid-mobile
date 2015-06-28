'use strict';

angular.module('groupeat.services.popup', [
  'ionic',
  'pascalprecht.translate'
])

.factory('Popup', function ($filter, $ionicPopup) {

    var $translate = $filter('translate');

    var /**
    * @ngdoc function
    * @name Popup#alert
    * @methodOf Popup
    *
    * @description
    * Displays and return a generic popup with a custom title and content
    * @param {String} title - The content of the error popup
    * @param {String} content - The content of the error popup
    */
    alert = function (title, content) {
      return $ionicPopup.alert({
        title: $translate(title),
        template: $translate(content)
      });
    },

    /**
    * @ngdoc function
    * @name Popup#confirm
    * @methodOf Popup
    *
    * @description
    * Displays and return a confirm popup with a custom title and content
    * @param {String} title - The content of the error popup
    * @param {String} content - The content of the error popup
    */
    confirm = function (title, content) {
      return $ionicPopup.confirm({
        title: $translate(title),
        template: $translate(content)
      });
    },


    /**
    * @ngdoc function
    * @name Popup#error
    * @methodOf Popup
    *
    * @description
    * Displays and return a generic error popup with a custom content
    *
    * @param {String} content - The content of the error popup
    */
    error = function (content) {
      return alert('whoops', content);
    },

    /**
    * @ngdoc function
    * @name Popup#title
    * @methodOf Popup
    *
    * @description
    * Displays and return a generic popup with a custom title and no content
    *
    * @param {String} title - The title of the popup
    */
    title = function(title) {
      return alert(title, '');
    };

    return {
      alert: alert,
      confirm: confirm,
      error: error,
      title: title
    };
  }
);
