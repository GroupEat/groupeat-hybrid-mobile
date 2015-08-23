describe 'Ctrl: SettingsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.settings'
    module 'groupeat.services.error-message-resolver'
    module 'templates'
    module 'groupeat.directives'
    module 'jcs-autoValidate'

  rootScope = sandbox = ctrl = scope = $compile = $ionicSlideBoxDelegate = $q = $state = $timeout = _ = Address = Authentication = Credentials = Customer  = CustomerStorage = ElementModifier = ENV = formElement = Network = CustomerSettings = Popup = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      rootScope = $rootScope
      scope = $rootScope.$new()
      $compile = $injector.get '$compile'
      $ionicSlideBoxDelegate = $injector.get '$ionicSlideBoxDelegate'
      $q = $injector.get '$q'
      $state = $injector.get '$state'
      $timeout = $injector.get '$timeout'
      _ = $injector.get '_'
      Address = $injector.get 'Address'
      Analytics = $injector.get 'Analytics'
      Authentication = $injector.get 'Authentication'
      Credentials = $injector.get 'Credentials'
      sandbox.stub(Credentials, 'get').returns
        id: 1
      Customer = $injector.get 'Customer'
      CustomerStorage = $injector.get 'CustomerStorage'
      validator = $injector.get 'validator'
      ElementModifier = $injector.get 'ElementModifier'
      ErrorMessageResolver = $injector.get 'ErrorMessageResolver'
      validator.registerDomModifier(ElementModifier.key, ElementModifier)
      validator.setDefaultElementModifier(ElementModifier.key)
      validator.setErrorMessageResolver(ErrorMessageResolver.resolve)
      Network = $injector.get 'Network'
      CustomerSettings = $injector.get 'CustomerSettings'
      Popup = $injector.get 'Popup'
      ctrl = $controller('SettingsCtrl', (_: _, $ionicSlideBoxDelegate: $ionicSlideBoxDelegate, $q: $q, $rootScope: rootScope, $scope: scope, $state: $state, Address: Address, Analytics: Analytics, Authentication: Authentication, Credentials: Credentials, Customer: Customer, CustomerSettings: CustomerSettings, ElementModifier: ElementModifier, Network: Network, Popup: Popup))
      regex = new RegExp('^'+ENV.apiEndpoint+'/customers/\\d+$')
      $injector.get('$httpBackend').expect('GET', regex).respond(200, 'Success')

      # Hack to validate elements
      # Angular auto validate does not validate mock html elements
      # as it considers they are not visible (offset properties are 0)
      elementUtils = $injector.get('jcs-elementUtils')
      sandbox.stub(elementUtils, 'isElementVisible').returns(true)

  afterEach ->
    sandbox.restore()

  describe 'Constructor', ->

    it 'should create an empty customer settings object', ->
      scope.customerSettings.should.be.instanceof(Object)
      scope.customerSettings.should.be.empty

    it 'should create an empty customer identity object', ->
      scope.customerIdentity.should.be.instanceof(Object)
      scope.customerIdentity.should.be.empty

    it 'should create an empty customer address object', ->
      scope.customerAddress.should.be.instanceof(Object)
      scope.customerAddress.should.be.empty

    it 'should create an empty customer form object', ->
      scope.form.should.be.instanceof(Object)
      scope.form.should.be.empty

    it 'should create customerSettings object', ->
      scope.customerSettings.should.be.instanceof(Object)

    it 'should create an array of 2 tabs', ->
      scope.tabs.should.be.instanceof(Array)
      scope.tabs.should.have.length(2)

  describe 'SettingsCtrl#onReload', ->

    beforeEach ->
      scope.noNotificationAfterOptions = [
        {
          value: '21:00:00',
          label: '21h00'
        },
        {
          value: '22:00:00',
          label: '22h00'
        }
      ]

    it 'should call Customer Storage get methods', ->
      sandbox.spy CustomerStorage, 'getAddress'
      sandbox.spy CustomerStorage, 'getSettings'
      sandbox.spy CustomerStorage, 'getIdentity'
      scope.onReload()
      CustomerStorage.getAddress.should.have.been.called
      CustomerStorage.getSettings.should.have.been.called
      CustomerStorage.getIdentity.should.have.been.called

    it 'should load in the scope values of CustomerStorage service', ->
      scope.onReload()
      scope.customerSettings.should.deep.equal CustomerStorage.getSettings()
      scope.customerAddress.should.deep.equal CustomerStorage.getAddress()
      scope.customerIdentity.should.deep.equal CustomerStorage.getIdentity()


  describe 'SettingsCtrl#slideTo', ->

    it 'should call $ionicSlideBoxDelegate.slide with the given slideId parameter', ->
      slideId = 2
      sandbox.spy $ionicSlideBoxDelegate, 'slide'
      scope.slideTo slideId
      $ionicSlideBoxDelegate.slide.should.have.been.calledWithExactly slideId

    it 'should set the scope slideIndex to the given slideId parameter', ->
      slideId = 2
      scope.slideTo slideId
      scope.slideIndex.should.equal slideId

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
        '<input ng-model="customer.phoneNumber" name="phoneNumber" type="tel" ui-mask="+33 9-99-99-99-99">'+
        '</form>'
        )
      $compile(formElement)(scope)
      scope.$digest()
      scope.noNotificationAfterOptions = [
        {
          value: '21:00:00',
          label: '21h00'
        },
        {
          value: '22:00:00',
          label: '22h00'
        }
      ]
      scope.customerSettings =
        notificationsEnabled: true
        daysWithoutNotifying: 4
        noNotificationAfter:
          value: '22:00:00'
          label: '22h00'

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

    it 'should call CustomerStorage#setIdentity with the received customer if Customer.update is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when
        customer: 'customer'
      sandbox.stub(Authentication, 'updatePassword').returns($q.defer().promise)
      sandbox.spy(CustomerStorage, 'setIdentity')
      scope.onSave()
      scope.$digest()
      CustomerStorage.setIdentity.should.have.been.calledWithExactly
        customer: 'customer'

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

    it 'should call CustomerStorage#setAddress if Address.update is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(CustomerSettings, 'update').returns($q.defer().promise)
      sandbox.spy(CustomerStorage, 'setAddress')
      scope.onSave()
      scope.$digest()
      CustomerStorage.setAddress.should.have.been.called

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

    it 'should call Customer Storage with the received customerSettings if CustomerSettings.update is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns $q.when({})
      sandbox.stub(CustomerSettings, 'update').returns $q.when
        notificationsEnabled: false
        daysWithoutNotifying: 3
        noNotificationAfter: '21:00:00'
      sandbox.spy(CustomerStorage, 'setSettings')
      scope.onSave()
      scope.$digest()
      CustomerStorage.setSettings.should.have.been.calledWithExactly
        notificationsEnabled: false
        daysWithoutNotifying: 3
        noNotificationAfter: '21:00:00'

    it 'should display a confirmation popup if all previous steps succeeded', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(ElementModifier, 'validate').returns $q.when({})
      sandbox.stub(Customer, 'update').returns $q.when({})
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub(Authentication, 'updatePassword').returns $q.when({})
      sandbox.stub(CustomerSettings, 'update').returns $q.when({})
      sandbox.stub Popup, 'title'
      scope.onSave()
      scope.$digest()
      Popup.title.should.have.been.calledWithExactly 'customerEdited'

  describe 'SettingsCtrl on $ionicView.afterEnter', ->

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
