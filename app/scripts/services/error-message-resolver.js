'use strict';

angular.module('groupeat.services.error-message-resolver', ['sprintf'])

/*global vsprintf:true*/
.factory('ErrorMessageResolver', [
  '$q',
  '$filter',
  function ($q, $filter) {

    var $translate = $filter('translate');

    var isInteger = function(data) {
      var n = ~~Number(data);
      return String(n) === data && n >= 0;
    };

    var attributesWithMandatoryValues = {'minlength': isInteger, 'maxlength': isInteger};

    /**
    * @ngdoc function
    * @name ErrorMessageResolver#formatErrorMessage
    * @methodOf ErrorMessageResolver
    *
    * @description
    * Formats the error message so that values given for angular validation rules are inserted
    * into the error message
    *
    * @param {String} errorType - The type of validation error that has occurred.
    * @param {Element} el - The input element that is the source of the validation error.
    * @param {String} errorMessage - The error message with eventual placeholders for inserting validation attribute values
    * @returns {String} The error message with the validation attribute values inserted
    */
    var formatErrorMessage = function (errorType, el, errorMessage) {
      var parameter,
      parameters = [];
      if (el && el.attr) {
        parameter = el.attr(errorType);
        if (parameter === undefined) {
          parameter = el.attr('data-ng-' + errorType) || el.attr('ng-' + errorType);
        }

        if (errorType in attributesWithMandatoryValues)
        {
          if (!parameter)
          {
            throw new Error($translate('missingMandatoryAttributeValueError'));
          }
          else if (!attributesWithMandatoryValues[errorType](parameter))
          {
            throw new Error($translate('invalidMandatoryAttributeValueTypeError'));
          }
        }

        parameters.push(parameter || '');

        return vsprintf(errorMessage, parameters);
      }
      return errorMessage;
    };

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
      if (!el[0].name)
      {
        defer.reject(new Error($translate('missingFieldNameError')));
      }
      else
      {
        var fieldName = $translate(el[0].name+'FieldName');
        var errorMessage = $translate(errorType+'ErrorKey', { fieldName: fieldName });
        errorMessage = formatErrorMessage(errorType, el, errorMessage);
        defer.resolve(errorMessage);
      }
      return defer.promise;
    };

    return {
      formatErrorMessage: formatErrorMessage,
      resolve: resolve
    };
  }
]);
