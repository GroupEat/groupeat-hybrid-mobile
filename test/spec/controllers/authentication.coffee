describe 'Ctrl: AuthenticationCtrl', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.directives'
    module 'groupeat.controllers.authentication'
    module 'templates'

  Address = Authentication = AuthenticationCtrl = BackendUtils = Credentials = CustomerSettings = CustomerStorage = ElementModifier = scope = $state = $compile = $httpBackend = $timeout = $q = sandbox = elementUtils = formElement = Customer = Network = Popup =  {}

  formMock = 'form'

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $controller, $injector) ->

      sandbox = sinon.sandbox.create()

      validator = $injector.get 'validator'
      BackendUtils = $injector.get 'BackendUtils'
      ElementModifier = $injector.get 'ElementModifier'
      ErrorMessageResolver = $injector.get 'ErrorMessageResolver'
      validator.registerDomModifier ElementModifier.key, ElementModifier
      validator.setDefaultElementModifier ElementModifier.key
      validator.setErrorMessageResolver ErrorMessageResolver.resolve

      Address = $injector.get 'Address'
      Authentication = $injector.get 'Authentication'
      Credentials = $injector.get 'Credentials'
      Customer = $injector.get 'Customer'
      CustomerSettings = $injector.get 'CustomerSettings'
      CustomerStorage = $injector.get 'CustomerStorage'
      Network = $injector.get 'Network'
      Popup = $injector.get 'Popup'

      $httpBackend = $injector.get '$httpBackend'
      $timeout = $injector.get '$timeout'
      scope = $rootScope.$new()

      $state = $injector.get '$state'

      $q = $injector.get '$q'

      $compile = $injector.get '$compile'

      sandbox.spy Credentials, 'reset'
      sandbox.spy CustomerStorage, 'reset'
      AuthenticationCtrl = $controller('AuthenticationCtrl', {
        $scope: scope, $state: $state, $timeout: $timeout, $q: $q, $filter: $injector.get('$filter'), BackendUtils: BackendUtils, Address: Address, Authentication: Authentication, Customer: Customer, ElementModifier: ElementModifier, Network: Network, Popup: Popup, _: $injector.get('_')
      })

      # Hack to validate elements
      # Angular auto validate does not validate mock html elements
      # as it considers they are not visible (offset properties are 0)
      elementUtils = $injector.get('jcs-elementUtils')
      sandbox.stub(elementUtils, 'isElementVisible').returns(true)

      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  describe "Constructor", ->

    it 'should initialize as empty objects the different user forms', ->
      scope.user.should.be.empty

    it 'should reset the Credentials and the CustomerStorage information', ->
      Credentials.reset.should.have.been.called
      CustomerStorage.reset.should.have.been.called

  describe 'Authentication#slideHasChanged', ->

    it 'should set the value of scope.slideIndex to the given parameter', ->
      index = 42
      scope.slideHasChanged index
      scope.slideIndex.should.equal index

  describe 'Authentication#submitForm', ->

    it 'should call scope.submitRegisterForm with the given form if the registering parameter is true', ->
      sandbox.stub scope, 'submitLoginForm'
      sandbox.stub scope, 'submitRegisterForm'
      form = 'form'
      scope.submitForm form, true
      scope.submitLoginForm.should.not.have.been.called
      scope.submitRegisterForm.should.have.been.calledWithExactly form

    it 'should call scope.submitLoginForm with the given form otherwise', ->
      sandbox.stub scope, 'submitLoginForm'
      sandbox.stub scope, 'submitRegisterForm'
      form = 'form'
      scope.submitForm form, false
      scope.submitLoginForm.should.have.been.calledWithExactly form
      scope.submitRegisterForm.should.not.have.been.called

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
      sandbox.stub $state, 'go'

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
      sandbox.stub $state, 'go'

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.form)
      scope.$digest()

      Credentials.set.should.have.not.been.called
      $state.go.should.have.not.been.called
      Popup.error.should.have.been.called

    it 'if there is no client side validation error and if the server responds properly, the state should change to group-orders on form submit', ->
      sandbox.stub(Authentication, 'authenticate').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'get').returns $q.when({})
      sandbox.stub(Address, 'get').returns $q.when({})
      sandbox.stub(CustomerSettings, 'get').returns $q.when({})

      sandbox.stub Credentials, 'set'
      sandbox.stub Popup, 'error'
      sandbox.stub $state, 'go'

      window.browserTrigger(formElement, 'submit')
      scope.submitLoginForm(scope.loginForm)
      scope.$digest()

      Credentials.set.should.have.been.called
      $state.go.should.have.been.called
      Popup.error.should.have.not.been.called

  describe 'Authentication#submitRegisterForm', ->

    beforeEach ->
      scope.user =
        email: 'medmout@ensta.fr'

    it "should call Network.hasConnectivity", ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise

      scope.submitRegisterForm formMock
      scope.$digest()

      Network.hasConnectivity.should.have.been.called

    it "if Network.hasConnectivity is rejected, Popup.error should be called with the given errorMessage", ->
      errorMessage = 'noNetwork'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorMessage)
      sandbox.stub Popup, 'error'

      scope.submitRegisterForm formMock
      scope.$digest()

      Popup.error.should.have.been.calledWithExactly errorMessage

    it "if Network.hasConnectivity is resolved, it should call ElementModifier.validate with the given form", ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.defer().promise

      scope.submitRegisterForm formMock
      scope.$digest()

      ElementModifier.validate.should.have.been.calledWithExactly formMock

    it "if ElementModifier.validate rejects an error message, Popup.error should be called with it", ->
      errorMessage = 'Invalid email'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.reject(errorMessage)
      sandbox.stub Popup, 'error'

      scope.submitRegisterForm formMock
      scope.$digest()

      Popup.error.should.have.been.calledWithExactly errorMessage

    it "if ElementModifier.validate is resolved, Customer.save should be called with the user params and the french locale", ->
      expectedRequestBody =
        email: 'medmout@ensta.fr'
        locale: 'fr'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'save').returns $q.defer().promise

      scope.submitRegisterForm formMock
      scope.$digest()

      Customer.save.should.have.been.calledWithExactly expectedRequestBody

    it "if Customer.save is resolved, CustomerStorage#setDefaultSettings should be called", ->
      expectedId = '1'
      expectedToken = 'token'
      sandbox.stub(Customer, 'save').returns $q.when
        id: expectedId
        token: expectedToken
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub $state, 'go'
      sandbox.stub CustomerStorage, 'setDefaultSettings'

      scope.submitRegisterForm formMock
      scope.$digest()

      CustomerStorage.setDefaultSettings.should.have.been.called

    it "if Customer.save is resolved, Credentials.set should be called with the given credentials", ->
      expectedId = '1'
      expectedToken = 'token'
      sandbox.stub(Customer, 'save').returns $q.when
        id: expectedId
        token: expectedToken
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub $state, 'go'
      sandbox.stub Credentials, 'set'

      scope.submitRegisterForm formMock
      scope.$digest()

      Credentials.set.should.have.been.calledWithExactly expectedId, expectedToken

    it "if Customer.save is resolved, $state.go should be called  to reach signup", ->
      errorMessage = 'errorMessage'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'save').returns $q.when({})

      sandbox.stub Credentials, 'set'
      sandbox.stub $state, 'go'

      scope.submitRegisterForm formMock
      scope.$digest()

      $state.go.should.have.been.calledWithExactly('app.signup')
