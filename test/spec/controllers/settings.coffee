describe 'Ctrl: SettingsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.settings'
    module 'groupeat.services.error-message-resolver'
    module 'templates'
    module 'groupeat.directives'
    module 'jcs-autoValidate'

  sandbox = ctrl = scope = $compile = $httpBackend = $filter = $q = $state = $timeout = _ = Address = Authentication = Credentials = Customer = ElementModifier = ENV = formElement = MessageBackdrop = Network = NotificationsSettings = Popup = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $compile = $injector.get('$compile')
      $filter = $injector.get('$filter')
      $q = $injector.get('$q')
      $state = $injector.get('$state')
      $timeout = $injector.get('$timeout')
      _ = $injector.get('_')
      Address = $injector.get('Address')
      Authentication = $injector.get('Authentication')
      Credentials = $injector.get('Credentials')
      Customer = $injector.get('Customer')
      validator = $injector.get('validator')
      ElementModifier = $injector.get('ElementModifier')
      ErrorMessageResolver = $injector.get('ErrorMessageResolver')
      validator.registerDomModifier(ElementModifier.key, ElementModifier)
      validator.setDefaultElementModifier(ElementModifier.key)
      validator.setErrorMessageResolver(ErrorMessageResolver.resolve)
      MessageBackdrop = $injector.get('MessageBackdrop')
      Network = $injector.get('Network')
      NotificationsSettings = $injector.get('NotificationsSettings')
      Popup = $injector.get('Popup')
      ENV = $injector.get('ENV')
      ctrl = $controller('SettingsCtrl', ($filter: $filter, $scope:scope, $state: $state, _: _, Address: Address, Authentication: Authentication, Credentials: Credentials, Customer: Customer, ElementModifier: ElementModifier, MessageBackdrop: MessageBackdrop, Network: Network, NotificationsSettings: NotificationsSettings, Popup: Popup))
      $httpBackend = $injector.get('$httpBackend')
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $httpBackend.expect('GET', regex).respond(200, 'Success')

      # Hack to validate elements
      # Angular auto validate does not validate mock html elements
      # as it considers they are not visible (offset properties are 0)
      elementUtils = $injector.get('jcs-elementUtils')
      sandbox.stub(elementUtils, 'isElementVisible').returns(true)

  afterEach ->
    sandbox.restore()

  beforeEach ->
    scope.$digest()

  describe 'Constructor', ->

    it 'should create an empty customer object', ->
      scope.customer.should.be.instanceof(Object)
      scope.customer.should.be.empty

    it 'should create an empty customer form object', ->
      scope.form.should.be.instanceof(Object)
      scope.form.should.be.empty

    it 'should create notificationsPreferences object', ->
      scope.notificationsPreferences.should.be.instanceof(Object)

    it 'should create an array of 2 tabs', ->
      scope.tabs.should.be.instanceof(Array)
      scope.tabs.should.have.length(2)

  describe 'SettingsCtrl#onReload', ->

    it 'should load the non empty array of daysWithoutNotifying', ->
      sandbox.spy(NotificationsSettings, 'getDaysWithoutNotifying')
      scope.onReload()
      NotificationsSettings.getDaysWithoutNotifying.should.have.been.called
      scope.daysWithoutNotifying.should.be.not.empty

    it 'should load the non empty array of noNotificationAfterHours', ->
      sandbox.spy(NotificationsSettings, 'getNoNotificationAfterHours')
      scope.onReload()
      NotificationsSettings.getNoNotificationAfterHours.should.have.been.called
      scope.noNotificationAfterHours.should.be.not.empty

    it 'should load notification preferences', ->
      # TODO : Connect with backend

    it 'should load the non empty array of residencies', ->
      sandbox.spy(Address, 'getResidencies')
      scope.onReload()
      Address.getResidencies.should.have.been.called
      scope.residencies.should.be.not.empty

    it 'should show a no network message backdrop if no network is available', ->
      messageBackdrop = MessageBackdrop.noNetwork()
      sandbox.stub(Network, 'hasConnectivity').returns(false)
      sandbox.spy(MessageBackdrop, 'noNetwork')
      scope.onReload()
      MessageBackdrop.noNetwork.should.have.been.called
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should call Customer#get if connectivity is available', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get').returns($q.defer().promise)
      scope.onReload()
      Customer.get.should.have.been.called

    it 'should show a generic failure message backdrop if getting the customer fails', ->
      messageBackdrop = MessageBackdrop.genericFailure()
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get').returns($q.reject())
      sandbox.spy(MessageBackdrop, 'genericFailure')
      scope.onReload()
      scope.$digest()
      MessageBackdrop.genericFailure.should.have.been.called
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should load the customer in the scope if getting the customer succeeds', ->
      customer = 'customer'
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve(customer)
        return deferred.promise
      )
      sandbox.stub(Address, 'get').returns($q.defer().promise)
      scope.onReload()
      scope.$digest()
      scope.customer.should.equal(customer)

    it 'should call Address#get if getting the customer succeeds', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Address, 'get').returns($q.defer().promise)
      scope.onReload()
      scope.$digest()
      Address.get.should.have.been.called

    it 'should show a generic failure message backdrop if getting the customer succeeds but getting his address fails', ->
      messageBackdrop = MessageBackdrop.genericFailure()
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Address, 'get').returns($q.reject())
      sandbox.spy(MessageBackdrop, 'genericFailure')
      scope.onReload()
      scope.$digest()
      MessageBackdrop.genericFailure.should.have.been.called
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should add residency and details information ot the customer in scope if getting the customer address succeeds', ->
      customer = {}
      details = 'details'
      residency = 'residency'
      address =
        details: details
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve(customer)
        return deferred.promise
      )
      sandbox.stub(Address, 'get', ->
        deferred = $q.defer()
        deferred.resolve(address)
        return deferred.promise
      )
      sandbox.stub(Address, 'getResidencyInformationFromAddress').returns(residency)
      scope.onReload()
      scope.$digest()
      Address.getResidencyInformationFromAddress.should.have.been.called
      scope.customer.details.should.equal(details)
      scope.customer.residency.should.equal(residency)

  describe 'SettingsCtrl#onSave', ->

    submitFormWithViewValues = (oldPassword, newPassword, phoneNumber) ->
      form = scope.form.customerEdit
      form.oldPassword.$setViewValue(oldPassword) if oldPassword?
      form.newPassword.$setViewValue(newPassword) if newPassword?
      form.phoneNumber.$setViewValue(phoneNumber) if phoneNumber?
      scope.$digest()
      window.browserTrigger(formElement, 'submit')
      return form

    beforeEach ->
      formElement = angular.element(
        '<form name="form.customerEdit">'+
        '<input ng-model="customer.oldPassword" name="oldPassword" type="password" ng-minlength="6">'+
        '<input ng-model="customer.newPassword" name="newPassword" type="password" ng-minlength="6">'+
        '<input ng-model="customer.phoneNumber" name="phoneNumber" type="tel" ge-phone-format>'+
        '</form>'
        )
      $compile(formElement)(scope)
      scope.$digest()

    it 'the form should be initially invalid and pristine', ->
      form = scope.form.customerEdit
      form.$valid.should.be.true
      form.$invalid.should.be.false
      form.$pristine.should.be.true
      form.$dirty.should.be.false

    it 'should fail client side validation if the oldPassword is not empty but too short', ->
      # TODO

    it 'should fail client side validation if the newPassword is not empty but too short', ->
      # TODO

    it 'should fail client side validation if the phoneNumber is not valid', ->
      # TODO

    it 'should display an error popup if client side validation fails', ->
      errorMessage = 'errorMessage'
      sandbox.stub(ElementModifier, 'validate').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'displayError')
      scope.onSave()
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly(errorMessage, 3000)

    it 'should call Customer#update if client side validation succeeds', ->
      sandbox.stub(ElementModifier, 'validate', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Customer, 'update').returns($q.defer().promise)
      scope.onSave()
      scope.$digest()
      Customer.update.should.have.been.called

    it 'should display an error popup if client side validation fails but Customer#update fails', ->
      errorMessage = 'errorMessage'
      sandbox.stub(ElementModifier, 'validate', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Customer, 'update').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'displayError')
      scope.onSave()
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly(errorMessage, 3000)

    it 'should call Address#update if client side validation and Customer#update', ->
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
      sandbox.stub(Address, 'update').returns($q.defer().promise)
      scope.onSave()
      scope.$digest()
      Address.update.should.have.been.called

    it 'should display an error popup if client side validation and Customer#update succeed but Address#update fails', ->
      errorMessage = 'errorMessage'
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
      sandbox.stub(Address, 'update').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'displayError')
      scope.onSave()
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly(errorMessage, 3000)

    it 'should call Authentication#updatePassword if client side validation, Customer#update and Address#update succeed', ->
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
      sandbox.stub(Authentication, 'updatePassword').returns($q.defer().promise)
      scope.onSave()
      scope.$digest()
      Authentication.updatePassword.should.have.been.called

    it 'should display an error popup if client side validation, Customer#update, Address#update succeed but Authentication#updatePassword fails', ->
      errorMessage = 'errorMessage'
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
      sandbox.stub(Authentication, 'updatePassword').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'displayError')
      scope.onSave()
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly(errorMessage, 3000)

    it 'should display a confirmation popup if all previous steps succeeded', ->
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
      sandbox.stub(Authentication, 'updatePassword', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Popup, 'displayTitleOnly')
      scope.onSave()
      scope.$digest()
      Popup.displayTitleOnly.should.have.been.calledWithExactly('customerEdited', 3000)
