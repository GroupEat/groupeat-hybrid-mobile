'use strict';

describe('Ctrl: AuthenticationCtrl', function () {

  // Load the controller's module
  beforeEach(module('groupeat'));

  var AuthenticationCtrl,
  scope,
  $state,
  $compile,
  $httpBackend,
  $timeout,
  $q,
  sandbox,
  elementUtils,
  formElement;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope, $controller, $injector) {
    sandbox = sinon.sandbox.create();
    $httpBackend = $injector.get('$httpBackend');
    scope = $rootScope.$new();

    $state = $injector.get('$state');
    sandbox.stub($state, 'go');

    $q = $injector.get('$q');

    $compile = $injector.get('$compile');
    $timeout = $injector.get('$timeout');
    AuthenticationCtrl = $controller('AuthenticationCtrl', {
      $scope: scope, $state: $state, $ionicPopup: $injector.get('$ionicPopup'), $timeout: $injector.get('$timeout'), $ionicModal: $injector.get('$ionicModal'), $filter: $injector.get('$filter'), Customer: $injector.get('Customer'), ElementModifier: $injector.get('ElementModifier')
    });

    // Hack to validate elements
    // Angular auto validate does not validate mock html elements
    // as it considers they are not visible (offset properties are 0)
    elementUtils = $injector.get('jcs-elementUtils');
    sandbox.stub(elementUtils, 'isElementVisible').returns(true);

    $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>');
    $httpBackend.whenGET(/^translations\/.*/).respond('{}');
  }));

  afterEach(function () {
    sandbox.restore();
  });

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
    });

  });

  describe('Logging in', function() {

    beforeEach(function() {
      formElement = angular.element(
        '<form style="width: 500px, height:200px" name="loginForm" ng-submit="submitFn()">'+
        '<input style="width: 500px, height:200px" ng-model="userLogin.email" name="email" type="email" ge-campus-email required ge-campus-email-err-type="campusEmail" />'+
        '<input  style="width: 500px, height:200px" ng-model="userLogin.password" name="password" type="password" required ng-minlength="6" />'+
        '</form>'
      );
      $compile(formElement)(scope);
      scope.$digest();
    });

    it('the form should be initially invalid and pristine', function(){
      var form = scope.loginForm;
      form.$valid.should.be.false;
      form.$invalid.should.be.true;
      form.$pristine.should.be.true;
      form.$dirty.should.be.false;
    });

    it('the validateForm promise should initially reject a requiredErrorKey Error either if the email field is empty or the email field is valid and the password field empty', function(){
      var form = scope.loginForm;
      // Both fields are empty
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'requiredErrorKey');
      $timeout.flush();

      // The email field is present and valid
      form.email.$setViewValue('campusemail@ensta.fr');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'requiredErrorKey');
      $timeout.flush();

      // The password field is present and valid
      form.email.$setViewValue('');
      form.password.$setViewValue('validpassword');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'requiredErrorKey');
      $timeout.flush();
    });

    it('the validateForm promise should reject an emailErrorKey Error if the view value is not an email', function(){
      var form = scope.loginForm;
      form.email.$setViewValue('not a valid email');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'emailErrorKey');
      $timeout.flush();
    });

    it('the validateForm promise should reject a geEmailErrorKey Error if the view value is not a valid campus email but a valid email', function(){
      var form = scope.loginForm;
      form.email.$setViewValue('notacampusemail@gmail.com');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'geCampusEmailErrorKey');
      $timeout.flush();
    });

    it('the validateForm promise should reject a minlengthErrorKey Error if the email is valid but the password field less than 6 characters', function(){
      var form = scope.loginForm;
      form.email.$setViewValue('campusemail@ensta.fr');
      form.password.$setViewValue('short');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.rejectedWith(Error, 'minlengthErrorKey');
      $timeout.flush();
    });

    it('the validateForm promise should be resolved if both fields are valid', function(){
      var form = scope.loginForm;
      form.email.$setViewValue('campusemail@ensta.fr');
      form.password.$setViewValue('longer');
      window.browserTrigger(formElement, 'submit');
      scope.validateForm(form).should.be.resolved;
      $timeout.flush();
    });

    it('if there is a validation error, the state should not change on form submit', function() {
      // We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(scope, 'validateForm').returns($q.reject(new Error('errorMessage')));

      window.browserTrigger(formElement, 'submit');
      scope.submitLoginForm(scope.loginForm);
      $timeout.flush();
      // The state should not change
      $state.go.should.have.not.been.called;
    });

    it('if there is no validation error, the state should not change on form submit', function() {
      // We use a stub to make sure the validateForm promise is resolved
      sandbox.stub(scope, 'validateForm', function(form) {
        var deferred = $q.defer();
        deferred.resolve();
        return deferred.promise;
      });

      window.browserTrigger(formElement, 'submit');
      scope.submitLoginForm(scope.loginForm);
      $timeout.flush();
      // The state should change to group-orders
      $state.go.should.have.been.calledWith('group-orders');
    });

  });

  describe('Resetting password', function() {
    //scope.showResetPasswordPopup();
  });

  describe('Registering (First Step)', function() {

  });

  describe('Registering (Second Optional Step)', function() {

  });

});
