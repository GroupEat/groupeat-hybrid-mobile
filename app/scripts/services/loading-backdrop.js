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

    totalBackdrop = function() {
      return {
        show: true,
        class: 'total-backdrop',
      };
    },

    barAndTabsBackdrop = function() {
      return {
        show: true,
        class: 'bar-and-tabs-backdrop',
      };
    },

    barBackdrop = function() {
      return {
        show: true,
        class: 'bar-backdrop',
      };
    },

    subBarBackdrop = function() {
      return {
        show: true,
        class: 'sub-bar-backdrop',
      };
    };

    return {
      noBackdrop: noBackdrop,
      totalBackdrop: totalBackdrop,
      barAndTabsBackdrop: barAndTabsBackdrop,
      barBackdrop: barBackdrop,
      subBarBackdrop: subBarBackdrop
    };

  }
]);
