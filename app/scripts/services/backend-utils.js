'use strict';

angular.module('groupeat.services.backend-utils', [
  'constants',
  'ionic',
  'ngResource',
  'pascalprecht.translate',
  'sprintf',
  'groupeat.services.credentials',
  'groupeat.services.lodash'
])

.factory('BackendUtils', function ($filter, $state, _, Credentials) {
  var $translate = $filter('translate');
  var vsprintf = $filter('vsprintf');
  var errorKeysRequiringAuthentication = [
    'noUserForAuthenticationToken',
    'userMustAuthenticate'
  ];
  /**
    * @ngdoc function
    * @name BackendUtils#getErrorObjectFromBackend
    * @methodOf BackendUtils
    *
    * @description
    * Returns the first error key and its matching field from the backend for the first field which was invalid
    * with an additional value matching this error key if relevant
    *
    * @param {Object} response - The response from the backend
    */
  var getErrorObjectFromBackend = function (response) {
      if (!_.has(response, 'data') || !_.has(response.data, 'data')) {
        return undefined;
      }
      var responseData = response.data.data;
      if (_.has(responseData, 'errors') && responseData.errors !== null && typeof responseData.errors === 'object') {
        for (var field in responseData.errors) {
          if (responseData.errors[field] === null || typeof responseData.errors[field] !== 'object') {
            continue;
          }
          for (var error in responseData.errors[field]) {
            if (!(responseData.errors[field][error] instanceof Array)) {
              continue;
            }
            var errorObjectFromBackend = {
              errorKey: error,
              field: field
            };
            if (responseData.errors[field][error].length > 0) {
              errorObjectFromBackend.additionalValue = responseData.errors[field][error];
            }
            return errorObjectFromBackend;
          }
        }
      } else if (_.has(responseData, 'errorKey')) {
        // Those errorKey require a redirection to the authentication view
        if (errorKeysRequiringAuthentication.indexOf(responseData.errorKey) > -1) {
          Credentials.reset();
          $state.go('app.authentication');
        }
        return { errorKey: responseData.errorKey };
      }
      return undefined;
    },
    /**
    * @ngdoc function
    * @name BackendUtils#getErrorKeyFromBackend
    * @methodOf BackendUtils
    *
    * @description
    * Returns the first error key from the backend for the first field which was invalid
    *
    * @param {Object} response - The response from the backend
    */
    getErrorKeyFromBackend = function (response) {
      var errorObject = getErrorObjectFromBackend(response);
      if (errorObject === undefined) {
        return undefined;
      }
      return errorObject.errorKey;
    },
    /**
    * @ngdoc function
    * @name BackendUtils#getErrorMsgFromBackend
    * @methodOf BackendUtils
    *
    * @description
    * Returns the first error message with the proper locale from the backend for the first field which was invalid
    *
    * @param {Object} response - The response from the backend
    */
    getErrorMsgFromBackend = function (response) {
      var errorObject = getErrorObjectFromBackend(response);
      if (errorObject === undefined) {
        return undefined;
      }
      var fieldName = $translate(errorObject.field + 'FieldName');
      var label = errorObject.errorKey + 'ErrorKey';
      var errorMessage = $translate(label, { fieldName: fieldName });
      // If the errorMessage equals the translated label, the errorKey was not translated by the application
      // So we return a generic error message.
      if (errorMessage === label) {
        return $translate('genericFailureDetails');
      }
      return _.has(errorObject, 'additionalValue') ? vsprintf(errorMessage, errorObject.additionalValue) : errorMessage;
    };
  return {
    errorKeyFromBackend: getErrorKeyFromBackend,
    errorMsgFromBackend: getErrorMsgFromBackend
  };
});
