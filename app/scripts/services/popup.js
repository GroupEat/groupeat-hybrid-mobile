'use strict';

angular.module('groupeat.services.popup', [
  'ngMaterial',
  'pascalprecht.translate'
])

.factory('Popup', function ($filter, $mdDialog, $timeout) {

    var $translate = $filter('translate');

    var /**
    * @ngdoc function
    * @name Popup#displayError
    * @methodOf Popup
    *
    * @description
    * Displays and return a generic error popup with a custom content
    *
    * @param {String} contentMessage - The content of the error popup
    * @param {Bool} timeout - Time in ms after which the popup automatically closes (with 0, it never will)
    */
    displayError = function (contentMessage, timeout) {
      var popup = $mdDialog.show(
        $mdDialog.alert({
          parent: angular.element(document.body)
        })
        .title($translate('whoops'))
        .content(contentMessage)
        .ok($translate('ok'))
      );
      if (timeout)
      {
        $timeout(function() {
          $mdDialog.hide();
        }, timeout);
      }
      return popup;
    },

    /**
    * @ngdoc function
    * @name Popup#displayTitleOnly
    * @methodOf Popup
    *
    * @description
    * Displays and return a generic popup with a custom title and no content
    *
    * @param {String} title - The title of the popup
    * @param {Bool} timeout - Time in ms after which the popup automatically closes (with 0, it never will)
    */
    displayTitleOnly = function(title, timeout) {
      var popup = $mdDialog.show(
        $mdDialog.alert({
          parent: angular.element(document.body)
        })
        .title(title)
        .ok($translate('ok'))
      );
      if (timeout)
      {
        $timeout(function() {
          $mdDialog.hide();
        }, timeout);
      }
      return popup;
    };

    return {
      displayError: displayError,
      displayTitleOnly: displayTitleOnly
    };
  }
);
