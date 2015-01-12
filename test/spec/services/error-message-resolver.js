'use strict';

describe('Service: ErrorMessageResolver', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var ErrorMessageResolver, scope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $httpBackend, _ErrorMessageResolver_) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('<html></html>');
    ErrorMessageResolver = _ErrorMessageResolver_;
  }));

  describe("ErrorMessageResolver#formatErrorMessage", function() {

    it('should leave the error message intact when el is not an angular element', function() {
      var errorType = 'required';
      var el = '<input>';
      var errorMessage = 'This field is required';
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(errorMessage);
    });

    it('should leave the error message intact when the string does not include a placeholder', function() {
      var errorType = 'required';
      var el = angular.element('<input required>');
      var errorMessage = 'This field is required';
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(errorMessage);
    });

    it('should format an error message when the field has an validation attribute value', function() {
      var errorType = 'minlength';
      var el = angular.element('<input ng-minlength="6">');
      var errorMessage = 'This field should have at least %s characters';
      var formattedErrorMessage = 'This field should have at least 6 characters';
      ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage).should.equal(formattedErrorMessage);
    });

    it('should throw an exception when the minlength or maxlength attribute value is missing', function() {
      var errorType = 'minlength';
      var el = angular.element('<input ng-minlength>');
      var errorMessage = 'This field should have at least %s characters';
      expect(function() {ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage);}).to.throw(Error, 'missingMandatoryAttributeValueError');
    });

    it('should throw an exception when the minlength or maxlength attribute value is not an integer', function() {
      var errorType = 'minlength';
      var el = angular.element('<input ng-minlength="wa">');
      var errorMessage = 'This field should have at least %s characters';
      expect(function() {ErrorMessageResolver.formatErrorMessage(errorType, el, errorMessage);}).to.throw(Error, 'invalidMandatoryAttributeValueTypeError');
    });

  });

  describe("ErrorMessageResolver#resolve", function() {

    afterEach(function() {
      scope.$apply();
    });

    it('should return the error message for an error type', function() {
      var errorType = 'required';
      var el = angular.element('<input name="requiredField">');
      ErrorMessageResolver.resolve(errorType, el).then(function (errorMessage) {
        errorMessage.should.equal('requiredErrorKey');
      });
    });

    it('should throw an exception when the name attribute is missing from a field', function() {
      var errorType = 'required';
      var el = angular.element('<input>');
      var promise = ErrorMessageResolver.resolve(errorType, el);
      ErrorMessageResolver.resolve(errorType, el).catch(function (error) {
        error.should.be.an.instanceof(Error);
        error.message.should.equal('missingFieldNameError');
      });
    });

  });

});
