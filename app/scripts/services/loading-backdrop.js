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
        circular: 'classical',
      };
    },

    barAndTabsBackdrop = function() {
      return {
        show: true,
        class: 'bar-and-tabs-backdrop',
        circular: 'classical',
      };
    },

    barBackdrop = function() {
      return {
        show: true,
        class: 'bar-backdrop',
        circular: 'classical',
      };
    },

    dialogBackdrop = function() {
      return {
        show: true,
        class: 'dialog-backdrop',
        circular: 'dialog-circular',
      };
    },

    subBarBackdrop = function() {
      return {
        show: true,
        class: 'sub-bar-backdrop',
        circular: 'classical',
      };
    };

    return {
      noBackdrop: noBackdrop,
      totalBackdrop: totalBackdrop,
      barAndTabsBackdrop: barAndTabsBackdrop,
      barBackdrop: barBackdrop,
      subBarBackdrop: subBarBackdrop,
      dialogBackdrop: dialogBackdrop
    };

  }
]);
