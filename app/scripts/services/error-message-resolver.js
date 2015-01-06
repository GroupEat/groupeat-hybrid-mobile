'use strict';

/**
* Replaces string placeholders with corresponding template string
*/
if (!('format' in String.prototype)) {
  String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] !== undefined ? args[number] : match;
    });
  };
}

angular.module('groupeat.services.error-message-resolver', [])

.factory('ErrorMessageResolver', [
  '$q',
  '$filter',
  function ($q, $filter) {

    var $translate = $filter('translate');

    /**
    * @ngdoc function
    * @name ErrorMessageResolver#resolve
    * @methodOf ErrorMessageResolver
    *
    * @description
    * Resolves a validate error type into a user validation error message
    *
    * @param {String} errorType - The type of validation error that has occurred.
    * @param {Element} el - The input element that is the source of the validation error.
    * @returns {Promise} A promise that is resolved when the validation message has been produced.
    */
    var resolve = function (errorType, el) {
      var defer = $q.defer();
      var fieldName = $translate(el[0].name+'FieldName');
      var errorMsg = $translate(errorType+'ErrorKey', { fieldName: fieldName });
      var parameter,
      parameters = [];
      if (el && el.attr) {
        try {
          parameter = el.attr(errorType);
          if (parameter === undefined) {
            parameter = el.attr('data-ng-' + errorType) || el.attr('ng-' + errorType);
          }

          parameters.push(parameter || '');

          errorMsg = errorMsg.format(parameters);
        } catch (e) {}
      }
      defer.resolve(errorMsg);
      return defer.promise;
    };

    return {
      resolve: resolve
    };
  }
]);
