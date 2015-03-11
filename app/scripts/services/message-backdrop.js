'use strict';

angular.module('groupeat.services.message-backdrop', [])

.factory('MessageBackdrop', [
  function() {

    var
    noBackdrop = function() {
      return {
        show: false
      };
    },

    noNetwork = function(buttonAction) {
      buttonAction = buttonAction || 'onReload()';
      return {
        show: true,
        title: 'noNetworkTitle',
        details: 'noNetworkDetails',
        iconClasses: 'ion-wifi',
        button: {
          text: 'reload',
          action: 'onReload()'
        },
      };
    },

    genericFailure = function(buttonAction) {
      buttonAction = buttonAction || 'onReload()';
      return {
        show: true,
        title: 'whoops',
        details: 'genericFailureDetails',
        iconClasses: 'ion-alert-circled',
        button: {
          text: 'reload',
          action: buttonAction
        }
      };
    };

    return {
      noBackdrop: noBackdrop,
      noNetwork: noNetwork,
      genericFailure: genericFailure,
    };

  }
]);
