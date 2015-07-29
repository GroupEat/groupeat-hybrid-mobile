describe 'Ctrl: AuthenticationCtrl', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.directives'
    module 'groupeat.controllers.authentication'
    module 'templates'

  Address = Authentication = BackendUtils = Credentials = AuthenticationCtrl = ElementModifier = scope = $state = $compile = $httpBackend = $timeout = $q = sandbox = elementUtils = formElement = Customer = DeviceAssistant = ENV = Popup =  {}

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
      Customer = $injector.get('Customer')
      Address = $injector.get('Address')
      Popup = $injector.get('Popup')
      DeviceAssistant = $injector.get('DeviceAssistant')

      $httpBackend = $injector.get('$httpBackend')
      $timeout = $injector.get('$timeout')
      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      $q = $injector.get('$q')

      $compile = $injector.get('$compile')
      AuthenticationCtrl = $controller('AuthenticationCtrl', {
        $scope: scope, $state: $state, $timeout: $timeout, $q: $q, $filter: $injector.get('$filter'), Address: Address, BackendUtils: BackendUtils, Authentication: Authentication, Customer: Customer, ElementModifier: ElementModifier, Popup: Popup, DeviceAssistant: DeviceAssistant, _: $injector.get('_')
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

    it 'should initialize as empty objects the different user forms', ->
      scope.user.should.be.empty

  describe 'Logging in', ->

    submitFormWithViewValues = (email, password) ->
      form = scope.form
      form.email.$setViewValue(email) if email?
      form.password.$setViewValue(password) if password?
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      return form

    beforeEach ->
      formElement = angular.element(
        '<form name="form" ng-submit="submitForm(form, false)">'+
        '<input ng-model="user.email" name="email" type="email" ge-campus-email required ge-campus-email />'+
        '<input ng-model="user.password" name="password" type="password" required ng-minlength="6" />'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it 'the form should be initially invalid and pristine', ->
      form = scope.form
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
      sandbox.stub(Authentication, 'authenticate').returns $q.defer().promise
      form = submitFormWithViewValues('campusemail@ensta.fr', 'longer')
      ElementModifier.validate(form).should.be.fulfilled
      $timeout.flush()

    it 'if there is a validation error, an error dialog should be displayed', ->
      # We use a stub to make sure the validateForm promise is rejected
      sandbox.stub(ElementModifier, 'validate').returns $q.reject('errorMessage')
      sandbox.stub Popup, 'error'
      sandbox.stub Credentials, 'set'

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$digest()

      Credentials.set.should.have.not.been.called
      $state.go.should.have.not.been.called
      Popup.error.should.have.been.called

    it 'if there is no client side validation error but an error from the server, an error dialog should be displayed', ->
      sandbox.stub(Authentication, 'authenticate').returns $q.reject()
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub Credentials, 'set'
      sandbox.stub Popup, 'error'

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.form)
      scope.$digest()

      Credentials.set.should.have.not.been.called
      $state.go.should.have.not.been.called
      Popup.error.should.have.been.called

    it 'if there is no client side validation error and if the server responds properly, the state should change to group-orders on form submit', ->
      sandbox.stub(Authentication, 'authenticate').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub Credentials, 'set'
      sandbox.stub Popup, 'error'

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$digest()

      Credentials.set.should.have.been.called
      $state.go.should.have.been.called
      Popup.error.should.have.not.been.called

  describe 'Registering (First Step)', ->

    submitFormWithViewValues = (email, password) ->
      form = scope.form
      form.email.$setViewValue(email) if email?
      form.password.$setViewValue(password) if password?
      form.passwordConfirm.$setViewValue(passwordConfirm) if passwordConfirm?
      scope.$apply()
      window.browserTrigger(formElement, 'submit')
      return form

    beforeEach ->
      formElement = angular.element(
        '<form name="form" ng-submit="submitForm(form, true)">'+
        '<input ng-model="user.email" name="email" type="email" ge-campus-email required ge-campus-email-err-type="campusEmail">'+
        '<input ng-model="user.password" name="password" type="password" required ng-minlength="6">'+
        '</form>'
      )
      $compile(formElement)(scope)
      scope.$digest()

    it "if there is a validation error, an error dialog should be displayed and Customer.save should not be called", ->
      sandbox.stub(ElementModifier, 'validate').returns $q.reject()
      sandbox.stub Popup, 'error'
      sandbox.stub Customer, 'save'

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm scope.form
      scope.$digest()

      Popup.error.should.have.been.called
      Customer.save.should.have.not.been.called

    it "if there is no client side validation error but a server side error, Customer.save should be called and an error dialog should be displayed", ->
      content = 'content'
      sandbox.stub(Customer, 'save').returns $q.reject(content)
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub Popup, 'error'

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm scope.form
      scope.$digest()

      Popup.error.should.have.been.calledWithExactly content
      Customer.save.should.been.called

    it "if there is no client side validation error, no server side error, DeviceAssistant.register should be called and an error dialog should be displayed", ->
      sandbox.stub(Customer, 'save').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(DeviceAssistant, 'register').returns($q.reject(new Error('errorMessage')))
      sandbox.stub Popup, 'error'
      sandbox.stub Credentials, 'set'

      window.browserTrigger(formElement, 'submit')
      scope.submitRegisterForm scope.form
      scope.$digest()

      Popup.error.should.have.been.called
      Credentials.set.should.have.been.called
      DeviceAssistant.register.should.have.been.called
