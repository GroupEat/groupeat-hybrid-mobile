'use strict';

angular.module('groupeat.services.element-modifier', [])

.factory('ElementModifier', function($timeout, $q) {

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

    /**
    * @ngdoc function
    * @name ElementModifier#validate
    * @methodOf ElementModifier
    *
    * @description
    * Returns a promise
    * if resolved, the form is properly validated
    * if rejected, it will reject the error message of the form
    *
    * @param {Object} form - The form to validate
    */
    validate = function(form) {
      var deferred = $q.defer();
      $timeout(function() {
          if (form.$invalid)
          {
            var errorMessage = getErrorMsg(form.$name);
            deferred.reject(errorMessage);
          }
          else
          {
            deferred.resolve();
          }
        });
      return deferred.promise;
    };

    return {
      makeValid: makeValid,
      makeInvalid: makeInvalid,
      makeDefault: makeDefault,
      errorMsg: getErrorMsg,
      validate: validate,
      key: 'ElementModifier'
    };
  }
);
