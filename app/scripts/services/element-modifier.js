'use strict';

angular.module('groupeat.services.element-modifier', [
  'pascalprecht.translate',
  'sprintf'
])

/*global vsprintf:true*/
.factory('ElementModifier', function ($filter) {

    var $translate = $filter('translate');

    var scopeErrorMsg = {};
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

    getErrorKeyFromBackend = function(response) {
      for (var field in response.data.errors) {
        for (var error in response.data.errors[field]) {
          return error;
        }
      }
      return undefined;
    },

    getErrorMsgFromBackend = function(response) {
      for (var field in response.data.errors) {
        for (var error in response.data.errors[field]) {
          var fieldName = $translate(field+'FieldName');
          var errorMessage = $translate(error+'ErrorKey', {fieldName: fieldName});
          return response.data.errors[field][error] ? vsprintf(errorMessage, response.data.errors[field][error]) : errorMessage;
        }
      }
      return undefined;
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
