describe 'Ctrl: SignupCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.signup'
    module 'templates'

  scope = rootScope = $ionicSlideBoxDelegate = $q = $state = $state = Address = Credentials = Customer = Network = Popup = sandbox = {}

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
      Network = $injector.get 'Network'
      Popup = $injector.get 'Popup'

      SignupCtrl = $controller('SignupCtrl', {
        _: $injector.get('_'), $ionicSlideBoxDelegate: $ionicSlideBoxDelegate, $scope: scope, $state: $state, Address: Address, Credentials: Credentials, Customer: Customer, Network: Network, Popup: Popup
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

    it 'should call $state.go to the group-orders if Address.update is resolved', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when {}
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.stub(Address, 'getAddressFromResidencyInformation').returns addressMock
      sandbox.stub(Customer, 'update').returns $q.when
        id: '1'
      sandbox.stub(Address, 'update').returns $q.when({})
      sandbox.stub $state, 'go'
      scope.confirmSignup()
      scope.$digest()
      $state.go.should.have.been.calledWithExactly 'app.group-orders'
