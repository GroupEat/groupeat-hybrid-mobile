'use strict';

angular.module('groupeat.services.loading-backdrop', ['ngMaterial'])

.factory('LoadingBackdrop', [
  function() {

    var
    noBackdrop = function() {
      return {
        show: false
      };
    },

    backdrop = function(backdropType, backdropClass, circularClass) {
      /*
      backdropType  = backdrop-get || backdrop-interact
      backdropClass = with-bar-and-tabs || with-sub-bar || with-dialog
      circularClass = dialog-circular || classical
      */
      return {
        show: true,
        type: backdropType,
        class: backdropClass || 'total-backdrop',
        circular: circularClass || 'classical'
      };
    };

    return {
      noBackdrop: noBackdrop,
      backdrop: backdrop
    };

  }
]);
