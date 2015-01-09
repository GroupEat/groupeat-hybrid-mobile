'use strict';

angular.module('groupeat.services.element-modifier', [])

.factory('ElementModifier', [
  function () {
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
    /*jshint unused: false */
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

    getErrorMsg = function(formName) {
      for (var fieldName in scopeErrorMsg[formName]) {
        return scopeErrorMsg[formName][fieldName];
      }
    };

    return {
      makeValid: makeValid,
      makeInvalid: makeInvalid,
      makeDefault: makeDefault,
      errorMsg: getErrorMsg,
      key: 'ElementModifier'
    };
  }
]);
