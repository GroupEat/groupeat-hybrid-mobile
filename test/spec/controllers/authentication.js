'use strict';

describe('Ctrl: AuthenticationCtrl', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var AuthenticationCtrl,
  httpBackend,
  scope,
  state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $state, $httpBackend, $ionicPopup, $timeout, $ionicModal, $filter, Customer, ElementModifier) {
    httpBackend = $httpBackend;
    state = $state;
    scope = $rootScope.$new();
    AuthenticationCtrl = $controller('AuthenticationCtrl', {
      $scope: scope, $state: state, $ionicPopup: $ionicPopup, $timeout: $timeout, $ionicModal: $ionicModal, $filter: $filter, Customer: Customer, ElementModifier: ElementModifier
    });
    httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  describe("Constructor", function() {

    it('should initialize the variables meant to show/hide dom elements', function() {
      scope.showLoginAndRegisterButtons.should.be.true;
      scope.showLoginEnergizedBackButton.should.be.false;
      scope.showLoginAssertiveBackButton.should.be.false;
      scope.showSkipFurtherRegisterButton.should.be.false;
      scope.showSubmitFurtherRegisterButton.should.be.false;
      scope.showLoginForm.should.be.false;
      scope.showRegisterForm.should.be.false;
    });

    it('should initialize as empty objects the different user forms', function() {
      scope.userLogin.should.be.empty;
      scope.userReset.should.be.empty;
      scope.userRegister.should.be.empty;
    });

    it('should initialize the validation error as undefined', function() {
      expect(scope.validationError).to.be.undefined;
    });

  });

  describe("Navigating between the initial view to login/register forms", function() {

    it('should properly modify the variables for dom showing/hiding when clicking on the register button', function(){
        scope.onRegisterButtonTouch();
        scope.showLoginAndRegisterButtons.should.be.false;
        scope.showRegisterForm.should.be.true;
        scope.showLoginForm.should.be.false;
        scope.showLoginEnergizedBackButton.should.be.false;
        scope.showLoginAssertiveBackButton.should.be.true;
    });

    it('should properly reset the variables for dom showing/hiding when clicking on the back to initial view button from register', function(){
      scope.onRegisterButtonTouch();
      scope.onBackToMainViewButtonTouch();
      scope.showLoginAndRegisterButtons.should.be.true;
      scope.showLoginEnergizedBackButton.should.be.false;
      scope.showLoginAssertiveBackButton.should.be.false;
      scope.showSkipFurtherRegisterButton.should.be.false;
      scope.showSubmitFurtherRegisterButton.should.be.false;
      scope.showLoginForm.should.be.false;
      scope.showRegisterForm.should.be.false;
    });
    /*
    it('should properly modify the variables for dom showing/hiding when clicking on the login button', function(){
      scope.onLoginButtonTouch();
      scope.showLoginAndRegisterButtons.should.be.false;
      scope.showRegisterForm.should.be.false;
      scope.showLoginForm.should.be.true;
      scope.showLoginEnergizedBackButton.should.be.true;
      scope.showLoginAssertiveBackButton.should.be.false;
    });

    it('should properly reset the variables for dom showing/hiding when clicking on the back to initial view button from login', function(){
      scope.onLoginButtonTouch();
      scope.onBackToMainViewButtonTouch();
      scope.showLoginAndRegisterButtons.should.be.true;
      scope.showLoginEnergizedBackButton.should.be.false;
      scope.showLoginAssertiveBackButton.should.be.false;
      scope.showSkipFurtherRegisterButton.should.be.false;
      scope.showSubmitFurtherRegisterButton.should.be.false;
      scope.showLoginForm.should.be.false;
      scope.showRegisterForm.should.be.false;
    });*/

  });

  describe('Logging in', function() {

  });

  describe('Resetting password', function() {

  });

  describe('Registering (First Step)', function() {

  });

  describe('Registering (Second Optional Step)', function() {

  });

});
