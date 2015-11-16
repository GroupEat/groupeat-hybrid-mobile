describe 'Ctrl: SignupCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.signup'
    module 'templates'

  scope = rootScope = $ionicSlideBoxDelegate = $q = $state = $state = Address = Credentials = Customer = CustomerStorage = DeviceAssistant = Network = Popup = sandbox = {}

  userMock =
    firstName: 'Walter'
    lastName: 'White'
    phoneNumber: '666666666'
    residency: 'ENSTAParisTech'
    addressSupplement: 'On the roof'

  addressMock =
    street: 'Mean street'
    latitude: 121
    longitude: 121

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      rootScope = $rootScope
      scope = $rootScope.$new()

      $ionicSlideBoxDelegate = $injector.get '$ionicSlideBoxDelegate'
      $q = $injector.get '$q'
      $state = $injector.get '$state'
      Address = $injector.get 'Address'
      Credentials = $injector.get 'Credentials'
      Customer = $injector.get 'Customer'
      CustomerStorage = $injector.get 'CustomerStorage'
      DeviceAssistant = $injector.get 'DeviceAssistant'
      Network = $injector.get 'Network'
      Popup = $injector.get 'Popup'

      SignupCtrl = $controller('SignupCtrl', {
        _: $injector.get('_'), $ionicSlideBoxDelegate: $ionicSlideBoxDelegate, $scope: scope, $state: $state, Address: Address, Credentials: Credentials, Customer: Customer, DeviceAssistant: DeviceAssistant, Network: Network, Popup: Popup
      })
      $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond '{}'

  afterEach ->
    sandbox.restore()

  describe "Constructor", ->

    it 'should initialize the slideIndex', ->
      scope.slideIndex.should.equal 0

    it 'should create an empty user object', ->
      scope.user.should.deep.equal {}

  describe "SignupCtrl#onReload", ->

    it 'should call $ionicSlideBoxDelegate with the given argument', ->
      index = 42
      sandbox.stub $ionicSlideBoxDelegate, 'slide'
      scope.slideTo index
      $ionicSlideBoxDelegate.slide.should.have.been.calledWithExactly  index

    it 'should set the scope slideIndex to the given argument', ->
      index = 42
      scope.slideTo index
      scope.slideIndex.should.equal index

  describe "SignupCtrl#confirmSignup", ->

    beforeEach ->
      scope.user = userMock

    it 'should call Network.hasConnectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise
      scope.confirmSignup()
      Network.hasConnectivity.should.have.been.called

    it 'should call Popup.error with the given errorMessage when Network.hasConnectivity is rejected', ->
      errorMessage = 'noNetwork'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject errorMessage
      sandbox.stub Popup, 'error'
      scope.confirmSignup()
      scope.$digest()
      Popup.error.should.have.been.calledWithExactly errorMessage

    it 'should call Credentials.get if Network.hasConnectivity is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: "1"
      sandbox.stub(Customer, 'update').returns $q.defer().promise
      scope.confirmSignup()
      scope.$digest()
      Credentials.get.should.have.been.called

    it 'should call Customer.update with its id and params if Network.hasConnectivity is resolved', ->
      expectedCustomerId = "1"
      expectedCustomerParams =
        firstName: 'Walter'
        lastName: 'White'
        phoneNumber: '666666666'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Credentials, 'get').returns
        id: expectedCustomerId
      sandbox.stub(Customer, 'update').returns $q.defer().promise
      scope.confirmSignup()
      scope.$digest()
      Customer.update.should.have.been.calledWithExactly expectedCustomerId, expectedCustomerParams

    it 'should call CustomerStorage.setIdentity with the received response if Customer.update is resolved', ->
      expectedCustomerId = "1"
      customerUpdateResponse =
        response: 'response'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: expectedCustomerId
      sandbox.stub(Customer, 'update').returns $q.when
        response: 'response'
      sandbox.spy(CustomerStorage, 'setIdentity')
      sandbox.stub(Address, 'update').returns $q.defer().promise
      scope.confirmSignup()
      scope.$digest()
      CustomerStorage.setIdentity.should.have.been.calledWithExactly customerUpdateResponse

    it 'should call Address.update with the customer id and params if Customer.update is resolved', ->
      expectedCustomerId = "1"
      expectedAddressParams =
        street: 'Mean street'
        latitude: 121
        longitude: 121
        details: 'On the roof'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: expectedCustomerId
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns addressMock
      sandbox.stub(Customer, 'update').returns $q.when
        id: expectedCustomerId
      sandbox.stub(Address, 'update').returns $q.defer().promise
      scope.confirmSignup()
      scope.$digest()
      Address.update.should.have.been.calledWithExactly expectedCustomerId, expectedAddressParams

    it 'should call CustomerStorage#setAddress with the received response if Address.update is resolved', ->
      addressResponse =
        response: 'addressResponse'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns addressMock
      sandbox.stub(Customer, 'update').returns $q.when
        id: '1'
      sandbox.stub(Address, 'update').returns $q.when
        response: 'addressResponse'
      sandbox.stub $state, 'go'
      sandbox.stub CustomerStorage, 'setAddress'
      scope.confirmSignup()
      scope.$digest()
      CustomerStorage.setAddress.should.have.been.calledWithExactly addressResponse

    it 'should call scope.hasSignedUp if Address.update is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns addressMock
      sandbox.stub(Customer, 'update').returns $q.when
        id: '1'
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub scope, 'hasSignedUp'
      scope.confirmSignup()
      scope.$digest()
      scope.hasSignedUp.should.have.been.called

  describe "SignupCtrl#hasSignedUp", ->

    beforeEach ->
      sandbox.stub $state, 'go'

    it 'should open a Popup welcoming the user', ->
      sandbox.spy(Popup, 'alert')

      scope.hasSignedUp()
      Popup.alert.should.have.been.calledWithExactly 'welcome', 'welcomeDetails'

    it 'if Popup.alert is resolved, DeviceAssistant.register should be called', ->
      sandbox.stub(Popup, 'alert').returns $q.when {}
      sandbox.spy(DeviceAssistant, 'register')

      scope.hasSignedUp()
      scope.$digest()

      DeviceAssistant.register.should.have.been.called

    it 'if DeviceAssistant.register is resolved, state should change to group-orders', ->
      sandbox.stub(Popup, 'alert').returns $q.when {}
      sandbox.stub(DeviceAssistant, 'register').returns $q.when {}

      scope.hasSignedUp()
      scope.$digest()

      $state.go.should.have.been.calledWithExactly 'app.group-orders'

    it 'if DeviceAssistant.register is rejected, Popup.error should be called', ->
      sandbox.stub(Popup, 'alert').returns $q.when {}
      sandbox.stub(DeviceAssistant, 'register').returns $q.reject()
      sandbox.spy(Popup, 'error')

      scope.hasSignedUp()
      scope.$digest()

      Popup.error.should.have.been.called
