describe 'Ctrl: AuthenticationCtrl', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.directives'
    module 'groupeat.controllers.authentication'
    module 'templates'

  Address = Authentication = BackendUtils = Credentials = AuthenticationCtrl = ElementModifier = scope = $state = $compile = $httpBackend = $timeout = $q = $mdDialog = sandbox = elementUtils = formElement = Customer = DeviceAssistant = ENV = Popup =  {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $controller, $injector) ->

      sandbox = sinon.sandbox.create()

      validator = $injector.get('validator')
      BackendUtils = $injector.get('BackendUtils')
      ElementModifier = $injector.get('ElementModifier')
      ErrorMessageResolver = $injector.get('ErrorMessageResolver')
      validator.registerDomModifier(ElementModifier.key, ElementModifier)
      validator.setDefaultElementModifier(ElementModifier.key)
      validator.setErrorMessageResolver(ErrorMessageResolver.resolve)

      Authentication = $injector.get('Authentication')
      Credentials = $injector.get('Credentials')
      sandbox.spy(Credentials, 'set')
      sandbox.spy(Credentials, 'reset')
      Customer = $injector.get('Customer')
      sandbox.spy(Customer, 'save')
      Address = $injector.get('Address')
      Popup = $injector.get('Popup')
      sandbox.stub(Popup, 'displayError')
      sandbox.stub(Popup, 'displayTitleOnly')
      DeviceAssistant = $injector.get('DeviceAssistant')

      $httpBackend = $injector.get('$httpBackend')
      $timeout = $injector.get('$timeout')
      $mdDialog = $injector.get('$mdDialog')
      sandbox.spy($mdDialog, 'hide')
      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      $q = $injector.get('$q')

      $compile = $injector.get('$compile')
      AuthenticationCtrl = $controller('AuthenticationCtrl', {
        $scope: scope, $state: $state, $mdDialog: $mdDialog, $timeout: $timeout, $q: $q, $filter: $injector.get('$filter'), Address: Address, BackendUtils: BackendUtils, Authentication: Authentication, Customer: Customer, ElementModifier: ElementModifier, Popup: Popup, DeviceAssistant: DeviceAssistant, ResidencyUtils: $injector.get('ResidencyUtils'), _: $injector.get('_')
      })

      # Hack to validate elements
      # Angular auto validate does not validate mock html elements
      # as it considers they are not visible (offset properties are 0)
      elementUtils = $injector.get('jcs-elementUtils')
      sandbox.stub(elementUtils, 'isElementVisible').returns(true)

      ENV = $injector.get('ENV')

      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  cleanDialog = ->
    body = angular.element(document.body)
    dialogContainer = body[0].querySelector('.md-dialog-container')
    dialogElement = angular.element(dialogContainer)
    dialogElement.remove()
    scope.$digest()

  afterEach ->
    cleanDialog()
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
      ElementModifier.validate(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

      # The email field is present and valid
      form = submitFormWithViewValues('campusemail@ensta.fr')
      ElementModifier.validate(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

      # The password field is present and valid
      form = submitFormWithViewValues('', 'validpassword')
      ElementModifier.validate(form).should.be.rejectedWith('requiredErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject an emailErrorKey Error if the view value is not an email', ->
      form = submitFormWithViewValues('not a valid email')
      ElementModifier.validate(form).should.be.rejectedWith('emailErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject a geEmailErrorKey Error if the view value is not a valid campus email but a valid email', ->
      form = submitFormWithViewValues('notacampusemail@gmail.com')
      ElementModifier.validate(form).should.be.rejectedWith('geCampusEmailErrorKey')
      $timeout.flush()

    it 'the validateForm promise should reject a minlengthErrorKey Error if the email is valid but the password field less than 6 characters', ->
      form = submitFormWithViewValues('campusemail@ensta.fr', 'short')
      ElementModifier.validate(form).should.be.rejectedWith('minlengthErrorKey')
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
      ElementModifier.validate(form).should.be.fulfilled
      $timeout.flush()

    it 'if there is a validation error, an error dialog should be displayed', ->
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate').returns($q.reject(new Error('errorMessage')))

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$apply()
      # Credentials.set should not be called
      Credentials.set.should.have.not.been.called
      # The state should not change
      $state.go.should.have.not.been.called
      # Popup.displayError should be called
      Popup.displayError.should.have.been.called

    it 'if there is no client side validation error but an error from the server, an error dialog should be displayed', ->
      $httpBackend.whenPUT(ENV.apiEndpoint+'/auth/token').respond(404, 'Failure')
      # We use a stub to make sure the validateForm promise is fulfilled
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$apply()
      $httpBackend.flush()
      # Credentials.set should not be called
      Credentials.set.should.have.not.been.called
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
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)

      $httpBackend.flush()

      # Credentials.set should be called
      Credentials.set.should.have.been.called
      # The state should change
      $state.go.should.have.been.called
      #Popup.displayError should not be called
      Popup.displayError.should.have.not.been.called

  describe 'Forgot password', ->

    beforeEach ->
      $compile(angular.element(
        '<form name="resetPasswordForm" ng-submit="submitRegisterForm(registerForm)">'+
        '<input ng-model="userReset.email" name="email" type="email" required ge-campus-email>'+
        '</form>'
        ))(scope)
      scope.$digest()

    it 'resetNotFoundValidity should not add the notFound error when it is initially not present', ->
      form = scope.resetPasswordForm
      scope.resetNotFoundValidity(form)
      form.email.$error.should.not.have.property('notFound')

    it 'resetNotFoundValidity should remove the notFound error when it is initially present', ->
      form = scope.resetPasswordForm
      form.email.$setValidity('notFound', false)
      form.email.$error.notFound.should.be.true
      scope.resetNotFoundValidity(form)
      form.email.$error.should.not.have.property('notFound')

    it 'showResetPasswordDialog should show a dialog when called', ->
      ev = {}
      scope.showResetPasswordDialog(ev)
      scope.$digest()
      body = angular.element(document.body)
      dialogContainer = body[0].querySelector('.md-dialog-container')
      expect(dialogContainer).to.be.not.null
      dialogElement = angular.element(dialogContainer)
      dialogElement.remove()

    it 'showResetPasswordDialog dialog should have a resetPassword title', ->
      ev = {}
      scope.showResetPasswordDialog(ev)
      scope.$digest()
      body = angular.element(document.body)
      dialogContainer = body[0].querySelector('.md-dialog-container')
      title = angular.element(dialogContainer).find('h2')
      title.text().should.contain('resetPassword')

    it 'showResetPasswordDialog dialog should have two buttons', ->
      ev = {}
      scope.showResetPasswordDialog(ev)
      scope.$digest()
      body = angular.element(document.body)
      dialogContainer = body[0].querySelector('.md-dialog-container')
      buttons = angular.element(dialogContainer).find('button')
      buttons.length.should.equal(2)
      buttons.eq(0).text().should.contain('cancel')
      buttons.eq(1).text().should.contain('ok')

    it 'showResetPasswordDialog dialog should have one email input element', ->
      ev = {}
      scope.showResetPasswordDialog(ev)
      scope.$digest()
      body = angular.element(document.body)
      dialogContainer = body[0].querySelector('.md-dialog-container')
      input = angular.element(dialogContainer).find('input')
      input.length.should.equal(1)
      input.attr('name').should.equal('email')

    it 'closeResetPasswordDialog should close the mdDialog when its second argument is true', ->
      $mdDialog.hide.should.not.have.been.called
      scope.closeResetPasswordDialog(scope.resetPasswordForm, true)
      $mdDialog.hide.should.have.been.called

    it 'closeResetPasswordDialog should not close the mdDialog when its second argument is false and the form invalid', ->
      form = scope.resetPasswordForm
      $mdDialog.hide.should.not.have.been.called

      scope.closeResetPasswordDialog(form, false)
      $mdDialog.hide.should.not.have.been.called

      form.email.$setViewValue('notanemail')
      $timeout.flush()
      scope.closeResetPasswordDialog(form, false)
      $mdDialog.hide.should.not.have.been.called

      form.email.$setViewValue('notacampusemail@gmail.com')
      $timeout.flush()
      scope.closeResetPasswordDialog(form, false)
      $mdDialog.hide.should.not.have.been.called

    it 'closeResetPasswordDialog should set an error field for the input when the server responds with an error', ->
      form = scope.resetPasswordForm
      $mdDialog.hide.should.not.have.been.called

      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      errorKey = 'notFound'
      sandbox.stub(BackendUtils, 'errorKeyFromBackend').returns(errorKey)
      sandbox.spy(Authentication, 'resetPassword')

      $httpBackend.expectDELETE(ENV.apiEndpoint+'/auth/password').respond(404, 'Error')

      scope.closeResetPasswordDialog(form, false)
      form.email.$error.should.not.have.property.errorKey
      scope.$digest()
      $httpBackend.flush()

      Authentication.resetPassword.should.have.been.called
      $mdDialog.hide.should.not.have.been.called
      form.email.$error[errorKey].should.be.true

    it 'closeResetPasswordDialog should close the dialog when the server responds properly', ->
      form = scope.resetPasswordForm
      $mdDialog.hide.should.not.have.been.called

      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.spy(Authentication, 'resetPassword')

      $httpBackend.expectDELETE(ENV.apiEndpoint+'/auth/password').respond(200, 'Success')

      scope.closeResetPasswordDialog(form, false)
      scope.$digest()
      $httpBackend.flush()

      Authentication.resetPassword.should.have.been.called
      $mdDialog.hide.should.have.been.called

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
      sandbox.stub(ElementModifier, 'validate').returns($q.reject(new Error('errorMessage')))

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)
      scope.$apply()

      Popup.displayError.should.have.been.called
      Customer.save.should.have.not.been.called

    it "if there is no client side validation error but a server side error, Customer.save should be called and an error dialog should be displayed", ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers').respond(404, 'Error')
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate', (form) ->
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

    it "if there is no client side validation error, no server side error, DeviceAssistant.register should be called and an error dialog should be displayed", ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(DeviceAssistant, 'register').returns($q.reject(new Error('errorMessage')))
      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)
      scope.$apply()

      $httpBackend.flush()

      Popup.displayError.should.have.been.called
      Credentials.set.should.have.been.called
      DeviceAssistant.register.should.have.been.called

    it 'if there are no errors, the shown dom elements should change to display the further registration form', ->
      $httpBackend.whenPOST(ENV.apiEndpoint+'/customers')
                      .respond(
                        data:
                          id:7,
                          token: 'jklhkjhlkhl'
                      )
      # We use a stub to make sure the validateForm promise is resolved
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(DeviceAssistant, 'register', (form) ->
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
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(DeviceAssistant, 'register', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )

      # The given email is an email from supoptique
      scope.registerForm.email.$setViewValue('stuff@institutoptique.fr')

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm(scope.registerForm)

      $httpBackend.flush()

      # The residency value should match supoptique
      scope.userRegister.residency.should.equal('supoptique')

  describe 'Registering (Second Optional Step)', ->

    beforeEach ->
      scope.onRegisterButtonTouch()
      formElement = angular.element(
        '<form name="furtherRegisterForm" ng-submit="submitFurtherRegisterForm(furtherRegisterForm)">'+
        '<input ng-model="userRegister.firstName" name="firstName" type="text">'+
        '<input ng-model="userRegister.lastName" name="lastName" type="text">'+
        '<input ng-model="userRegister.phoneNumber" name="phoneNumber" type="tel" ge-phone-format ge-phone-format-err-type="phoneFormat">'+
        '<select ng-model="userRegister.residency" name="residency">'+
        '<option value="1">ENSTA ParisTech</option>'+
        '<option value="2">Polytechnique</option>'+
        '<option value="3">Supoptique</option>'+
        '</select>'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it 'should take the state to group-orders when skipping further registering, and show a welcome popup', ->
      scope.hasRegistered(true)
      $state.go.should.have.been.calledWith('side-menu.group-orders')

    it 'should show a welcome popup when skipping further registering, which should disappear after a timeout', ->
      scope.userRegister.firstName = 'firstName'
      scope.hasRegistered(true)
      Popup.displayTitleOnly.should.have.been.calledWith('welcome', 3000)

    it 'should watch on all fields of the second step of userRegister', ->
      sandbox.spy(scope, 'updateFurtherRegisterButton')
      scope.updateFurtherRegisterButton.should.have.not.been.called
      scope.userRegister.firstName = 'firstName'
      scope.$digest()
      scope.updateFurtherRegisterButton.should.have.callCount(1)
      scope.userRegister.lastName = 'lastName'
      scope.$digest()
      scope.updateFurtherRegisterButton.should.have.callCount(2)
      scope.userRegister.phoneNumber = 'phoneNumber'
      scope.$digest()
      scope.updateFurtherRegisterButton.should.have.callCount(3)
      scope.userRegister.residency = 'residency'
      scope.$digest()
      scope.updateFurtherRegisterButton.should.have.callCount(4)

    it 'should not change the displaying state of the skip/submit buttons if the further register form is not showing when calling updateFurtherRegisterButton', ->
      scope.showFurtherRegisterForm = false
      previousShowSubmitFurtherRegisterButton = scope.showSubmitFurtherRegisterButton
      previousShowSkipFurtherSkipButton = scope.showSkipFurtherRegisterButton
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.equal.previousShowSubmitFurtherRegisterButton
      scope.showSkipFurtherRegisterButton.should.equal.previousShowSubmitFurtherRegisterButton

    it 'should show the skip button when showing the register form when an info is missing and calling updateFurtherRegisterButton', ->
      scope.showFurtherRegisterForm = true
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.true
      scope.userRegister.firstName = 'firstName'
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.true
      scope.userRegister.lastName = 'lastName'
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.true
      scope.userRegister.phoneNumber = 'phoneNumber'
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.be.false
      scope.showSkipFurtherRegisterButton.should.be.true

    it 'should show the submit button when showing the register form when all info are provided and calling updateFurtherRegisterButton', ->
      scope.showFurtherRegisterForm = true
      scope.userRegister.firstName = 'firstName'
      scope.userRegister.lastName = 'lastName'
      scope.userRegister.phoneNumber = 'phoneNumber'
      scope.userRegister.residency = 'residency'
      scope.updateFurtherRegisterButton()
      scope.showSubmitFurtherRegisterButton.should.be.true
      scope.showSkipFurtherRegisterButton.should.be.false

    it 'the form should be initially valid and pristine', ->
      form = scope.furtherRegisterForm
      form.$valid.should.be.true
      form.$invalid.should.be.false
      form.$pristine.should.be.true
      form.$dirty.should.be.false

    it 'the validateForm promise should initially be fulfilled', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(200, 'Success')
      scope.userId = 1
      form = scope.furtherRegisterForm
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      ElementModifier.validate(form).should.be.fulfilled
      $timeout.flush()

    it 'the validateForm promise should be rejected if an invalid phone number is given', ->
      # Both fields are empty
      form = scope.furtherRegisterForm
      #form.email.$setViewValue(email) if email?
      form.phoneNumber.$setViewValue('notAPhoneNumber')
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      ElementModifier.validate(form).should.be.rejectedWith('gePhoneFormatError')
      $timeout.flush()

    it 'the validateForm promise should be fulfilled if a proper phone number is given', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(200, 'Success')
      scope.userId = 1
      # Both fields are empty
      form = scope.furtherRegisterForm
      #form.email.$setViewValue(email) if email?
      form.phoneNumber.$setViewValue('0606060606')
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      ElementModifier.validate(form).should.be.fulfilled
      $timeout.flush()

    it "if there is a client side validation error, an error dialog should be displayed and Customer.update should not be called", ->
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate').returns($q.reject(new Error('errorMessage')))
      sandbox.spy(Customer, 'update')

      scope.submitFurtherRegisterForm(scope.registerForm)
      scope.$digest()

      Popup.displayError.should.have.been.called
      Customer.update.should.have.not.been.called

    it "if there are no client side validation errors but Customer.update returns an error, an error dialog should be displayed", ->
      sandbox.spy(Customer, 'update')
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(404, 'Error')
      scope.userId = 1
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.submitFurtherRegisterForm(scope.registerForm)
      scope.$digest()
      $httpBackend.flush()

      Popup.displayError.should.have.been.called
      Customer.update.should.have.been.called

    it "if there are no errors for updating the customer but Address.update returns an error, an error dialog should be displayed", ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('PUT', regex).respond(200, 'Success')
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+/address$')
      $httpBackend.expectPUT(regex).respond(404, 'Error')
      scope.userId = 1
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate', (form) ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.spy(Customer, 'update')
      sandbox.spy(Address, 'update')

      scope.submitFurtherRegisterForm(scope.registerForm)
      scope.$digest()
      $httpBackend.flush()
      Customer.update.should.have.been.called
      Popup.displayError.should.have.been.called
      Address.update.should.have.been.called

    it 'if there are no errors, the hasRegistered should be called', ->
      sandbox.stub(ElementModifier, 'validate', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Customer, 'update', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Address, 'update', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.spy(scope, 'hasRegistered')

      scope.submitFurtherRegisterForm(scope.registerForm)
      scope.$digest()

      Customer.update.should.have.been.called
      Address.update.should.have.been.called
      Popup.displayError.should.have.not.been.called
      scope.hasRegistered.should.have.been.calledWithExactly(false)
