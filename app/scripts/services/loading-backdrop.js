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

    backdrop = function(backdropClass, circularClass) {
      return {
        show: true,
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
