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
        button: 'reload'
      };
    },

    genericFailure = function() {
      return {
        show: true,
        title: 'whoops',
        details: 'genericFailureDetails',
        button: 'reload'
      };
    };

    return {
      noBackdrop: noBackdrop,
      noNetwork: noNetwork,
      genericFailure: genericFailure,
    };

  }
]);
