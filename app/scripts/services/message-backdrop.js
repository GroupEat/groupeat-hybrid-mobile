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

    noNetwork = function() {
      return {
        show: true,
        title: 'noNetworkTitle',
        details: 'noNetworkDetails',
        button: {
          text: 'reload',
          action: 'onReload()'
        }
      };
    },

    genericFailure = function() {
      return {
        show: true,
        title: 'whoops',
        details: 'genericFailureDetails',
        button: {
          text: 'reload',
          action: 'onReload()'
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
