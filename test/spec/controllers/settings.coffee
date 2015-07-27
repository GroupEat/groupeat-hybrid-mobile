describe 'Ctrl: SettingsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.settings'
    module 'groupeat.services.error-message-resolver'
    module 'templates'
    module 'groupeat.directives'
    module 'jcs-autoValidate'

  rootScope = sandbox = ctrl = scope = $compile = $httpBackend = $filter = $q = $state = $timeout = _ = Address = Authentication = Credentials = Customer = ElementModifier = ENV = formElement = Network = CustomerSettings = Popup = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      rootScope = $rootScope
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
      sandbox.stub(Credentials, 'get').returns
        id: 1
      Customer = $injector.get('Customer')
      validator = $injector.get('validator')
      ElementModifier = $injector.get('ElementModifier')
      ErrorMessageResolver = $injector.get('ErrorMessageResolver')
      validator.registerDomModifier(ElementModifier.key, ElementModifier)
      validator.setDefaultElementModifier(ElementModifier.key)
      validator.setErrorMessageResolver(ErrorMessageResolver.resolve)
      Network = $injector.get('Network')
      CustomerSettings = $injector.get('CustomerSettings')
      Popup = $injector.get('Popup')
      ENV = $injector.get('ENV')
      ctrl = $controller('SettingsCtrl', ($filter: $filter, $scope:scope, $state: $state, _: _, Address: Address, Authentication: Authentication, Credentials: Credentials, Customer: Customer, ElementModifier: ElementModifier, Network: Network, CustomerSettings: CustomerSettings, Popup: Popup))
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

  describe 'Constructor', ->

    it 'should create an empty customer object', ->
      scope.customer.should.be.instanceof(Object)
      scope.customer.should.be.empty

    it 'should create an empty customer form object', ->
      scope.form.should.be.instanceof(Object)
      scope.form.should.be.empty

    it 'should create customerSettings object', ->
      scope.customerSettings.should.be.instanceof(Object)

    it 'should create an array of 2 tabs', ->
      scope.tabs.should.be.instanceof(Array)
      scope.tabs.should.have.length(2)

    it 'should load the non empty array of daysWithoutNotifyingOptions', ->
      sandbox.spy(CustomerSettings, 'getDaysWithoutNotifying')
      scope.$broadcast '$ionicView.afterEnter'
      CustomerSettings.getDaysWithoutNotifying.should.have.been.called
      scope.daysWithoutNotifyingOptions.should.be.not.empty

    it 'should load the non empty array of noNotificationAfterHours', ->
      sandbox.spy(CustomerSettings, 'getNoNotificationAfterHours')
      scope.$broadcast '$ionicView.afterEnter'
      CustomerSettings.getNoNotificationAfterHours.should.have.been.called
      scope.noNotificationAfterOptions.should.be.not.empty

    it 'should load the non empty array of residencies', ->
      sandbox.spy(Address, 'getResidencies')
      scope.$broadcast '$ionicView.afterEnter'
      Address.getResidencies.should.have.been.called
      scope.residencies.should.be.not.empty

  describe 'SettingsCtrl#onReload', ->

    it 'should broadcast the displaying of a no network message backdrop if no network is available', ->
      errorKey = 'noNetwork'
      sandbox.spy rootScope, '$broadcast'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should call Customer#get if connectivity is available', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Customer, 'get').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      Customer.get.should.have.been.calledWithExactly(1)

    it 'should broadcast the displaying of a generic failure message backdrop if getting the customer fails', ->
      sandbox.spy rootScope, '$broadcast'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Customer, 'get').returns $q.reject()
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', undefined

    it 'should load the customer in the scope if getting the customer succeeds', ->
      customer = 'customer'
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve(customer)
        return deferred.promise
      sandbox.stub(Address, 'get').returns($q.defer().promise)
      scope.onReload()
      scope.$digest()
      scope.customer.should.equal(customer)

    it 'should call Address#get if getting the customer succeeds', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      sandbox.stub(Address, 'get').returns($q.defer().promise)
      scope.onReload()
      scope.$digest()
      Address.get.should.have.been.called

    it 'should broadcast the displaying of a generic failure message backdrop if getting the customer succeeds but getting his address fails', ->
      sandbox.spy rootScope, '$broadcast'
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      sandbox.stub(Address, 'get').returns $q.reject()
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', undefined

    it 'should add residency and details information to the customer in scope if getting the customer address succeeds', ->
      customer = {}
      details = 'details'
      residency = 'residency'
      address =
        details: details
        residency: residency
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve(customer)
        return deferred.promise
      sandbox.stub Address, 'get', ->
        deferred = $q.defer()
        deferred.resolve(address)
        return deferred.promise
      sandbox.stub(CustomerSettings, 'get').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      scope.customer.details.should.equal(details)
      scope.customer.residency.should.equal(residency)

    it 'should broadcast the displaying of a generic failure message backdrop if getting the customer and address succeeds but getting his settings fails', ->
      sandbox.spy rootScope, '$broadcast'
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Customer, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(Address, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      sandbox.stub(CustomerSettings, 'get').returns $q.reject()
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', undefined

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
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'error')
      scope.onSave()
      scope.$digest()
      Popup.error.should.have.been.calledWithExactly(errorMessage)

    it 'should call Customer#update if client side validation succeeds', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns($q.defer().promise)
      scope.onSave()
      scope.$digest()
      Customer.update.should.have.been.called

    it 'should display an error popup if client side validation succeeds but Customer#update fails', ->
      errorMessage = 'errorMessage'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      scope.customerSettings =
        noNotificationAfter:
          value: '22:00:00'
      sandbox.stub(Customer, 'update').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'error')
      scope.onSave()
      scope.$digest()
      Popup.error.should.have.been.calledWithExactly errorMessage

    it 'should call Address#update if client side validation and Customer#update succeed', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      address = 'address'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns(address)
      sandbox.stub(Address, 'update').returns($q.defer().promise)
      scope.customerSettings =
        noNotificationAfter:
          value: '22:00:00'
      scope.onSave()
      scope.$digest()
      Address.update.should.have.been.called

    it 'should display an error popup if client side validation and Customer#update succeed but Address#update fails', ->
      errorMessage = 'errorMessage'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      address = 'address'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns(address)
      sandbox.stub(Address, 'update').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'error')
      scope.customerSettings =
        noNotificationAfter:
          value: '22:00:00'
      scope.onSave()
      scope.$digest()
      Popup.error.should.have.been.calledWithExactly errorMessage

    it 'should call Authentication#updatePassword if client side validation, Customer#update and Address#update succeed', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns($q.defer().promise)
      scope.onSave()
      scope.$digest()
      Authentication.updatePassword.should.have.been.called

    it 'should display an error popup if client side validation, Customer#update, Address#update succeed but Authentication#updatePassword fails', ->
      errorMessage = 'errorMessage'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns($q.reject(errorMessage))
      sandbox.stub(Popup, 'error')
      scope.onSave()
      scope.$digest()
      Popup.error.should.have.been.calledWithExactly errorMessage

    it 'should call CustomerSettings#update if client side validation, Customer#update, Address#update and Authentication#updatePassword succeed', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns $q.when({})
      sandbox.stub(CustomerSettings, 'update').returns($q.defer().promise)
      address = 'address'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns(address)
      scope.customerSettings =
        noNotificationAfter:
          value: '22:00:00'
      scope.onSave()
      scope.$digest()
      CustomerSettings.update.should.have.been.called

    it 'should display a confirmation popup if all previous steps succeeded', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns $q.when({})
      customerSettings =
        noNotificationAfter: '22:00:00'
      sandbox.stub(CustomerSettings, 'update').returns $q.when(customerSettings)
      sandbox.stub Popup, 'title'
      address = 'address'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns address
      scope.customerSettings =
        noNotificationAfter:
          value: '22:00:00'
      scope.onSave()
      scope.$digest()
      Popup.title.should.have.been.calledWithExactly 'customerEdited'
