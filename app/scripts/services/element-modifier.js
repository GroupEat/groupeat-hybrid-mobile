'use strict';

angular.module('groupeat.services.element-modifier', [
  'pascalprecht.translate',
  'sprintf',
  'groupeat.services.lodash'
])

/*global vsprintf:true*/
.factory('ElementModifier', function ($filter, _) {

    var $translate = $filter('translate');

    var scopeErrorMsg = {};

    /**
    * @ngdoc function
    * @name ElementModifier#getErrorObjectFromBackend
    * @methodOf ElementModifier
    *
    * @description
    * Returns the first error key and its matching field from the backend for the first field which was invalid
    * with an additional value matching this error key if relevant
    *
    * @param {Object} response - The response from the backend
    */
    var getErrorObjectFromBackend = function(response) {
      if (!_.has(response, 'data') || !_.has(response.data, 'errors') || response.data.errors === null || typeof response.data.errors !== 'object')
      {
        return undefined;
      }
      for (var field in response.data.errors) {
        if (response.data.errors[field] === null || typeof response.data.errors[field] !== 'object') {
          continue;
        }
        for (var error in response.data.errors[field]) {
          if (!(response.data.errors[field][error] instanceof Array))
          {
            continue;
          }
          var errorObjectFromBackend = {errorKey: error, field: field};
          if (response.data.errors[field][error].length > 0)
          {
            errorObjectFromBackend.additionalValue = response.data.errors[field][error];
          }
          return errorObjectFromBackend;
        }
      }
      return undefined;
    };

    var /**
    * @ngdoc function
    * @name ElementModifier#makeValid
    * @methodOf ElementModifier
    *
    * @description
    * Makes an element appear valid by apply custom styles and child elements.
    *
    * @param {Element} el - The input control element that is the target of the validation.
    */
    makeValid = function (el) {
      var domElement = el[0];
      var formName = domElement.form.name;
      var elName = domElement.name;
      if (formName in scopeErrorMsg)
      {
        delete scopeErrorMsg[formName][elName];
      }
    },

    /**
    * @ngdoc function
    * @name ElementModifier#makeInvalid
    * @methodOf ElementModifier
    *
    * @description
    * Makes an element appear invalid by apply custom styles and child elements.
    *
    * @param {Element} el - The input control element that is the target of the validation.
    * @param {String} errorMsg - The validation error message to display to the user.
    */
    makeInvalid = function (el, errorMsg) {
      var domElement = el[0];
      var formName = domElement.form.name;
      var elName = domElement.name;

      if (!(formName in scopeErrorMsg))
      {
        scopeErrorMsg[formName] = {};
      }
      scopeErrorMsg[formName][elName] = errorMsg;
    },


    /**
    * @ngdoc function
    * @name ElementModifier#makeDefault
    * @methodOf ElementModifier
    *
    * @description
    * Makes an element appear in its default visual state.
    *
    * @param {Element} el - The input control element that is the target of the validation.
    */
    makeDefault = function (el) {
      makeValid(el);
    },

    /**
    * @ngdoc function
    * @name ElementModifier#getErrorMsg
    * @methodOf ElementModifier
    *
    * @description
    * Returns the first error message of a form, undefined if there is none
    *
    * @param {String} formName - The name of the form whose error is to be fetched
    */
    getErrorMsg = function(formName) {
      for (var fieldName in scopeErrorMsg[formName]) {
        return scopeErrorMsg[formName][fieldName];
      }
      return undefined;
    },

    /**
    * @ngdoc function
    * @name ElementModifier#getErrorKeyFromBackend
    * @methodOf ElementModifier
    *
    * @description
    * Returns the first error key from the backend for the first field which was invalid
    *
    * @param {Object} response - The response from the backend
    */
    getErrorKeyFromBackend = function(response) {
      var errorObject = getErrorObjectFromBackend(response);
      if (errorObject === undefined)
      {
        return undefined;
      }
      return errorObject.errorKey;
    },

    /**
    * @ngdoc function
    * @name ElementModifier#getErrorMsgFromBackend
    * @methodOf ElementModifier
    *
    * @description
    * Returns the first error message with the proper locale from the backend for the first field which was invalid
    *
    * @param {Object} response - The response from the backend
    */
    getErrorMsgFromBackend = function(response) {
      var errorObject = getErrorObjectFromBackend(response);
      if (errorObject === undefined)
      {
        return undefined;
      }
      var fieldName = $translate(errorObject.field+'FieldName');
      var errorMessage = $translate(errorObject.errorKey+'ErrorKey', {fieldName: fieldName});
      return _.has(errorObject, 'additionalValue') ? vsprintf(errorMessage, errorObject.additionalValue) : errorMessage;
    };

    return {
      makeValid: makeValid,
      makeInvalid: makeInvalid,
      makeDefault: makeDefault,
      errorMsg: getErrorMsg,
      errorKeyFromBackend: getErrorKeyFromBackend,
      errorMsgFromBackend: getErrorMsgFromBackend,
      key: 'ElementModifier'
    };
  }
);
