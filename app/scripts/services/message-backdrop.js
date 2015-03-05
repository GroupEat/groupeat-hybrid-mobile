'use strict';

/**
* @ngdoc service
* @name MessageBackDrop
* @module groupeat.services.message-backdrops
* @description
* Shows and hides a backdrop containing a message over the UI.
*
* Can be used to show either a message overriding the normal view for instance when the fetched dataset is empty
* or an error message (lack of network, error response from the backend, lack of permission)
*
* Therefore, each component that requires the backdrop to be shown calls
* `MessageBackdrop.show()` when it wants the backdrop, then `MessageBackdrop.hide()`
* when it is done with the backdrop.
*
*
* @usage
*
* ```js
* function MyController($scope, $ionicBackdrop, $timeout) {
*   //Show a backdrop for one second
*   $scope.action = function() {
*     MessageBackdrop.show();
*     $timeout(function() {
*       MessageBackdrop.hide();
*     }, 1000);
*   };
* }
* ```
*/
angular.module('groupeat.services.message-backdrop', ['ionic', 'pascalprecht.translate', 'groupeat.services.lodash'])

/*global ionic:true*/
.factory('MessageBackdrop', [
  '$document',
  '$timeout',
  '$filter',
  '_',
  function($document, $timeout, $filter, _) {

    var $translate = $filter('translate');

    var template = ['<div class="white-backdrop">',
    '<div class="center">',
    '<div class="card">',
    '<div class="item item-divider">',
    '<h1></h1>',
    '</div>',
    '<div class="item item-text-wrap">',
    '<p></p>',
    '<br>',
    '<button class="button button-outline button-block button-energized">',
    '</button>',
    '</div>',
    '</div>',
    '</div>'];
    var el = angular.element(template.join(''));
    var backdropHolds = 0;
    var body = angular.element($document[0].body);
    var parent = !_.isEmpty(body.find('ion-content')) ? body.find('ion-content') : body;
    parent[0].appendChild(el[0]);

    var
    show = function show(params) {
      var tags = {title: 'h1', details: 'p', button: 'button'};
      for (var section in tags)
      {
        el.find(tags[section]).text($translate(params[section]));
      }
      if ((++backdropHolds) === 1) {
        el.addClass('visible');
        ionic.requestAnimationFrame(function() {
          if(backdropHolds)
          {
            el.addClass('active');
          }
        });
      }
    },

    showNoNetwork = function() {
      var params = {
        title: 'noNetworkTitle',
        details: 'noNetworkDetails',
        button: 'reload'
      };
      return show(params);
    },

    showGenericFailure = function() {
      var params = {
        title: 'whoops',
        details: 'genericFailureDetails',
        button: 'reload'
      };
      return show(params);
    },

    hide = function release() {
      if ((--backdropHolds) === 0) {
        el.removeClass('active');
        $timeout(function() {
          if (!backdropHolds)
          {
            el.removeClass('visible');
          }
        }, 400, false);
      }
    },

    getElement = function getElement() {
      return el;
    };

    return {

      show: show,
      showNoNetwork: showNoNetwork,
      showGenericFaiure: showGenericFailure,

      hide: hide,

      getElement: getElement,

      // exposed for testing
      _element: el
    };

  }
]);
