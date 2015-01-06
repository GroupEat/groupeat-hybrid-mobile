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
      var elName = el[0].name;
      delete scopeErrorMsg[elName];
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
      var elName = el[0].name;
      scopeErrorMsg[elName] = errorMsg;
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
      var elName = el[0].name;
      delete scopeErrorMsg[elName];
    },

    getErrorMsg = function() {
      for (var prop in scopeErrorMsg) {
        return scopeErrorMsg[prop];
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
