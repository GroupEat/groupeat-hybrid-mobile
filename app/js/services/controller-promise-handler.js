'use strict';

angular.module('groupeat.services.controller-promise-handler', [
  'ui.router'
])

.factory('ControllerPromiseHandler', function ($rootScope, $state) {

  var
  /**
  * @ngdoc function
  * @name ControllerPromiseHandler#handler
  * @methodOf ControllerPromiseHandler
  *
  * @description
  * Handles the success and error cases of controller promises to broadcast the appropriate events
  * related to hiding/displaying the message backdrop
  *
  * @param {Object} promise - The promise to handle
  * @param {string} controllerInitialState - The name of the state which initially caused the controller to load
  */
  handle = function (promise, controllerInitialState) {
    return promise
    .then(function() {
      if ($state.current.name === controllerInitialState) {
        $rootScope.$broadcast('hideMessageBackdrop');
      }
    })
    .catch(function(errorKey) {
      if ($state.current.name === controllerInitialState) {
        $rootScope.$broadcast('displayMessageBackdrop', errorKey);
      }
    });
  };

  return {
    handle: handle
  };

});
