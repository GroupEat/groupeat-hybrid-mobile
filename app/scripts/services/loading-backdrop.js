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

    backdrop = function() {
      return {
        show: true,
      };
    };

    return {
      noBackdrop: noBackdrop,
      backdrop: backdrop
    };

  }
]);
