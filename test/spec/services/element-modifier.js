'use strict';

describe('Service: ElementModifier', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var ElementModifier, scope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $httpBackend, _ElementModifier_) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('<html></html>');
    ElementModifier = _ElementModifier_;
  }));

  describe('Constructor', function() {
    it('should have an undefined errorMsg initially', function() {
      expect(ElementModifier.errorMsg('form')).to.be.undefined;
    });
  });

  describe("ElementModifier#makeInvalid", function() {

    it('should fetch an error message for the proper form when makeInvalid is called', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      var errorMsg = 'This field is invalid';
      ElementModifier.makeInvalid(form.find('input'), errorMsg);
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg);
    });

    it('should fetch an error message for the proper form when makeInvalid is called after makeValid was called', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      var errorMsg = 'This field is invalid';
      ElementModifier.makeValid(form.find('input'));
      ElementModifier.makeInvalid(form.find('input'), errorMsg);
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg);
    });

    it('should not fetch an error message for a form on which makeInvalid was not called', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      var errorMsg = 'This field is invalid';
      ElementModifier.makeInvalid(form.find('input'), errorMsg);
      expect(ElementModifier.errorMsg('otherForm')).to.be.undefined;
    });

    it('should fetch the first error message when makeInvalid is called for several fields', function() {
      var form = angular.element('<form name="form"><input name="field"><input name="otherField"></form>');
      var inputs = form.find('input');
      var errorMsg = 'This field is invalid';
      var otherErrorMsg = 'This other field is invalid';
      ElementModifier.makeInvalid(angular.element(inputs[0]), errorMsg);
      ElementModifier.makeInvalid(angular.element(inputs[1]), otherErrorMsg);
      expect(ElementModifier.errorMsg('form')).to.equal(errorMsg);
    });

  });

  describe("ElementModifier#makeValid", function() {

    it('should return an undefined error message when the form is made valid', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      ElementModifier.makeValid(form.find('input'));
      expect(ElementModifier.errorMsg('form')).to.be.undefined;
    });

    it('should return an undefined error message when the form is made valid after it was made invalid', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      ElementModifier.makeInvalid(form.find('input'), 'This field is invalid');
      ElementModifier.makeValid(form.find('input'));
      expect(ElementModifier.errorMsg('form')).to.be.undefined;
    });

  });

  describe("ElementModifier#makeDefault", function() {

    it('should return an undefined error message when the form is made valid', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      ElementModifier.makeDefault(form.find('input'));
      expect(ElementModifier.errorMsg('form')).to.be.undefined;
    });

    it('should return an undefined error message when the form is made valid after it was made invalid', function() {
      var form = angular.element('<form name="form"><input name="field"></form>');
      ElementModifier.makeInvalid(form.find('input'), 'This field is invalid');
      ElementModifier.makeDefault(form.find('input'));
      expect(ElementModifier.errorMsg('form')).to.be.undefined;
    });

  });

});
