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
    confirm = function (title, content, okText, cancelText) {
      okText = okText || 'OK';
      cancelText = cancelText || 'cancel';
      return $ionicPopup.confirm({
        title: $translate(title),
        template: $translate(content),
        cancelText: $translate(cancelText),
        okText: $translate(okText)
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
    * @name Popup#template
    * @methodOf Popup
    *
    * @description
    * Displays and return a popup including a custom template

    * @param {String} title
    * @param {String} templateUrl - The url of the template to show
    * @param {Object} scope
    * @param {Function} okAction - The function to call when pressing OK
    */
    template = function(title, templateUrl, scope, okAction) {
      return $ionicPopup.alert({
        title: $translate(title),
        templateUrl: templateUrl,
        scope: scope,
        buttons: [
          { text: $translate('Cancel') },
          {
            text: $translate('OK'),
            onTap: okAction
          }
        ]
      });
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
      template: template,
      title: title
    };
  }
);
