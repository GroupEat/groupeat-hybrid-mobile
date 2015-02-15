describe 'Ctrl: AuthenticationCtrl', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.directives'
    module 'groupeat.controllers.authentication'
    module 'templates'

  Authentication = AuthenticationCtrl = scope = $state = $compile = $httpBackend = $timeout = $q = $mdDialog = sandbox = elementUtils = formElement = Customer = ENV = Popup =  {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $controller, $injector) ->

      sandbox = sinon.sandbox.create()

      validator = $injector.get('validator')
      ElementModifier = $injector.get('ElementModifier')
      ErrorMessageResolver = $injector.get('ErrorMessageResolver')
      validator.registerDomModifier(ElementModifier.key, ElementModifier)
      validator.setDefaultElementModifier(ElementModifier.key)
      validator.setErrorMessageResolver(ErrorMessageResolver.resolve)

      Authentication = $injector.get('Authentication')
      sandbox.stub(Authentication, 'setCredentials')

      $httpBackend = $injector.get('$httpBackend')
      $mdDialog = $injector.get('$mdDialog')
      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      $q = $injector.get('$q')

      $compile = $injector.get('$compile')
      $timeout = $injector.get('$timeout')
      AuthenticationCtrl = $controller('AuthenticationCtrl', {
        $scope: scope, $state: $state, $mdDialog: $injector.get('$mdDialog'), $timeout: $injector.get('$timeout'), $q: $injector.get('$q'), $filter: $injector.get('$filter'), Address: $injector.get('Customer'), Authentication: Authentication, Customer: $injector.get('Customer'), ElementModifier: $injector.get('ElementModifier'), Popup: $injector.get('Popup'), ResidencyUtils: $injector.get('ResidencyUtils'), _: $injector.get('_')
      })

      # Hack to validate elements
      # Angular auto validate does not validate mock html elements
      # as it considers they are not visible (offset properties are 0)
      elementUtils = $injector.get('jcs-elementUtils')
      sandbox.stub(elementUtils, 'isElementVisible').returns(true)

      Customer = $injector.get('Customer')
      sandbox.spy(Customer, 'save')
      ENV = $injector.get('ENV')

      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

      Popup = $injector.get('Popup')
      sandbox.stub(Popup, 'displayError')
      sandbox.stub(Popup, 'displayTitleOnly')


  afterEach ->
    sandbox.restore()

  describe "Constructor", ->

    it 'should initialize the variables meant to show/hide dom elements', ->
      scope.showLoginAndRegisterButtons.should.be.true
      scope.showLoginEnergizedBackButton.should.be.false
      scope.showLoginAssertiveBackButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.false
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showLoginForm.should.be.false
      scope.showRegisterForm.should.be.false

    it 'should initialize as empty objects the different user forms', ->
      scope.userLogin.should.be.empty
      scope.userReset.should.be.empty
      scope.userRegister.should.be.empty

    it 'should initialize the validation error as undefined', ->
      expect(scope.validationError).to.be.undefined

  describe "Navigating between the initial view to login/register forms", ->

    it 'should properly modify the variables for dom showing/hiding when clicking on the register button', ->
      scope.onRegisterButtonTouch()
      scope.showLoginAndRegisterButtons.should.be.false
      scope.showRegisterForm.should.be.true
      scope.showLoginForm.should.be.false
      scope.showLoginEnergizedBackButton.should.be.false
      scope.showLoginAssertiveBackButton.should.be.true

    it 'should properly reset the variables for dom showing/hiding when clicking on the back to initial view button from register', ->
      scope.onRegisterButtonTouch()
      scope.onBackToMainViewButtonTouch()
      scope.showLoginAndRegisterButtons.should.be.true
      scope.showLoginEnergizedBackButton.should.be.false
      scope.showLoginAssertiveBackButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.false
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showLoginForm.should.be.false
      scope.showRegisterForm.should.be.false

    it 'should properly modify the variables for dom showing/hiding when clicking on the login button', ->
      scope.onLoginButtonTouch()
      scope.showLoginAndRegisterButtons.should.be.false
      scope.showRegisterForm.should.be.false
      scope.showLoginForm.should.be.true
      scope.showLoginEnergizedBackButton.should.be.true
      scope.showLoginAssertiveBackButton.should.be.false

    it 'should properly reset the variables for dom showing/hiding when clicking on the back to initial view button from login', ->
      scope.onLoginButtonTouch()
      scope.onBackToMainViewButtonTouch()
      scope.showLoginAndRegisterButtons.should.be.true
      scope.showLoginEnergizedBackButton.should.be.false
      scope.showLoginAssertiveBackButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.false
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showLoginForm.should.be.false
      scope.showRegisterForm.should.be.false

  describe 'Logging in', ->

    submitFormWithViewValues = (email, password) ->
      form = scope.loginForm
      form.email.$setViewValue(email) if email?
      form.password.$setViewValue(password) if password?
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      return form

    beforeEach ->
      formElement = angular.element(
        '<form name="loginForm" ng-submit="submitLoginForm(loginForm)">'+
        '<input ng-model="userLogin.email" name="email" type="email" ge-campus-email required ge-campus-email-err-type="campusEmail" />'+
        '<input ng-model="userLogin.password" name="password" type="password" required ng-minlength="6" />'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it 'the form should be initially invalid and pristine', ->
      form = scope.loginForm
      form.$valid.should.be.false
      form.$invalid.should.be.true
      form.$pristine.should.be.true
      form.$dirty.should.be.false

    it 'the validateForm promise should initially reject requiredErrorKey either if the email field is empty or the email field is valid and the password field empty', ->
      # Both fields are empty
      form = submitFormWithViewValues()
      scope.validateForm(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

      # The email field is present and valid
      form = submitFormWithViewValues('campusemail@ensta.fr')
      scope.validateForm(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

      # The password field is present and valid
      form = submitFormWithViewValues('', 'validpassword')
      scope.validateForm(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject an emailErrorKey Error if the view value is not an email', ->
      form = submitFormWithViewValues('not a valid email')
      scope.validateForm(form).should.be.rejectedWith('emailErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject a geEmailErrorKey Error if the view value is not a valid campus email but a valid email', ->
      form = submitFormWithViewValues('notacampusemail@gmail.com')
      scope.validateForm(form).should.be.rejectedWith('geCampusEmailErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject a minlengthErrorKey Error if the email is valid but the password field less than 6 characters', ->
      form = submitFormWithViewValues('campusemail@ensta.fr', 'short')
      scope.validateForm(form).should.be.rejectedWith('minlengthErrorKey')
      $timeout.flush()

    it 'the validateForm promise should be resolved if both fields are valid', ->
      # Needed because submitting will trigger the HTTP request
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      form = submitFormWithViewValues('campusemail@ensta.fr', 'longer')
      scope.validateForm(form).should.be.fulfilled
      $timeout.flush()

    it 'if there is a validation error, an error dialog should be displayed', ->
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(scope, 'validateForm').returns($q.reject(new Error('errorMessage')))

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$apply()
      # Authentication.setCredentials should not be called
      Authentication.setCredentials.should.have.not.been.called
      # The state should not change
      $state.go.should.have.not.been.called
      # Popup.displayError should be called
      Popup.displayError.should.have.been.called

    it 'if there is no client side validation error but an error from the server, an error dialog should be displayed', ->
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(404, 'Failure')
      # We use a stub to make sure the validateForm promise is fulfilled
      sandbox.stub(scope, 'validateForm', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$apply()
      $httpBackend.flush()
      # Authentication.setCredentials should not be called
      Authentication.setCredentials.should.have.not.been.called
      # The state should not change
      $state.go.should.have.not.been.called
      #Popup.displayError should be called
      Popup.displayError.should.have.been.called

    it 'if there is no client side validation error and if the server responds properly, the state should change to group-orders on form submit', ->
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      # We use a stub to make sure the validateForm promise is resolved
      sandbox.stub(scope, 'validateForm', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)

      $httpBackend.flush()

      # Authentication.setCredentials should be called
      Authentication.setCredentials.should.have.been.called
      # The state should change
      $state.go.should.have.been.called
      #Popup.displayError should not be called
      Popup.displayError.should.have.not.been.called

  describe 'Forgot password', ->

    it 'should show the popup when the showResetPasswordDialog method is called', ->
      # TODO : Missing test

    it 'should close the popup if the cancel button is selected', ->
      # TODO : Missing test

    it 'the validateForm promise should reject a requiredErrorKe Error if the view value is empty', ->
      # TODO : Missing test

    it 'the validateForm promise should reject a emailErrorKey Error if the view value is not a valid email', ->
      # TODO : Missing test

    it 'the validateForm promise should reject a geEmailErrorKey Error if the view value is not a valid campus email but a valid email', ->
      # TODO : Missing test

  describe 'Registering (First Step)', ->

    submitFormWithViewValues = (email, password) ->
      form = scope.registerForm
      form.email.$setViewValue(email) if email?
      form.password.$setViewValue(password) if password?
      form.passwordConfirm.$setViewValue(passwordConfirm) if passwordConfirm?
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      return form

    beforeEach ->
      scope.onRegisterButtonTouch()
      formElement = angular.element(
        '<form name="registerForm" ng-submit="submitRegisterForm(registerForm)">'+
        '<input ng-model="userRegister.email" name="email" type="email" ge-campus-email required ge-campus-email-err-type="campusEmail">'+
        '<input ng-model="userRegister.password" name="password" type="password" required ng-minlength="6">'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it "if there is a validation error, an error dialog should be displayed and Customer.save should not be called", ->
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(scope, 'validateForm').returns($q.reject(new Error('errorMessage')))

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)
      scope.$apply()

      Popup.displayError.should.have.been.called
      Customer.save.should.have.not.been.called

    it "if there is no client side validation error but a server side error, Customer.save should be called and an error dialog should be displayed", ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(404, 'Error')
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(scope, 'validateForm', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)
      scope.$apply()

      $httpBackend.flush()

      Popup.displayError.should.have.been.called
      Customer.save.should.been.called

    it 'if there are no errors, the shown dom elements should change to display the further registration form', ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      # We use a stub to make sure the validateForm promise is resolved
      sandbox.stub(scope, 'validateForm', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)

      $httpBackend.flush()

      scope.showRegisterForm.should.be.false
      scope.showLoginAssertiveBackButton.should.be.false
      scope.showFurtherRegisterForm.should.be.true
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.true

    it 'if there is no validation error and the email given was not an ENSTA email, the residency should be given a default value', ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      # We use a stub to make sure the validateForm promise is resolved
      sandbox.stub(scope, 'validateForm', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )

      # The given email is an email from supoptique
      scope.registerForm.email.$setViewValue('stuff@institutoptique.fr')

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)

      $httpBackend.flush()

      # The residency value should match supoptique's, hence 3
      scope.userRegister.residency.should.equal(3)

  describe 'Registering (Second Optional Step)', ->

    beforeEach ->
      scope.onRegisterButtonTouch()
      formElement = angular.element(
        '<form name="furtherRegisterForm" ng-submit="submitFurtherRegisterForm(furtherRegisterForm)">'+
        '<input ng-model="userRegister.firstName" type="text">'+
        '<input ng-model="userRegister.lastName" type="text>'+
        '<input ng-model="userRegister.phoneNumber" type="tel">'+
        '<input ng-model="userRegister.address" type="text">'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it 'should take the state to group-orders when skipping further registering, and show a welcome popup', ->
      scope.onSkipFurtherRegisterButtonTouch()
      $state.go.should.have.been.calledWith('group-orders')

    it 'should show a welcome popup when skipping further registering, which should disappear after a timeout', ->
      # TODO
