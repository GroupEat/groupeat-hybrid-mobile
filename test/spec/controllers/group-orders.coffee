describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  scope = $q = $httpBackend = $state = ControllerPromiseHandler = Customer = CustomerInformationChecker = GroupOrder = Geolocation = Network = Order = sandbox = ENV = $compile = {}

  positionMock = {
    'coords': {
      'latitude': 48,
      'longitude': 2
    }
  }

  emptyGroupOrdersMock = []

  groupOrdersMock = ['first', 'second']

  groupOrderMock =
    restaurant:
      data:
        id: 1

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->

      sandbox = sinon.sandbox.create()
      ControllerPromiseHandler = $injector.get 'ControllerPromiseHandler'
      Customer = $injector.get('Customer')
      CustomerInformationChecker = $injector.get 'CustomerInformationChecker'
      Order = $injector.get('Order')
      Geolocation = $injector.get('Geolocation')
      GroupOrder = $injector.get('GroupOrder')
      Network = $injector.get('Network')

      $httpBackend = $injector.get('$httpBackend')

      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')
      $q = $injector.get('$q')
      $compile = $injector.get('$compile')

      GroupOrdersCtrl = $controller('GroupOrdersCtrl', {
        $scope: scope, $state: $state, ControllerPromiseHandler: ControllerPromiseHandler, Customer: Customer, Geolocation: Geolocation, GroupOrder: GroupOrder, Network: Network, Order: Order, _: $injector.get('_')
      })
      ENV = $injector.get('ENV')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  describe "GroupOrders#onReload", ->

    beforeEach ->
      scope.initialState = 'initial'

    it 'should check connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise
      scope.onReload()
      Network.hasConnectivity.should.have.been.called

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noNetwork if there is no network', ->
      errorKey = 'noNetwork'
      expectedPromise = $q.reject errorKey
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      sandbox.spy ControllerPromiseHandler, 'handle'
      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should check user current position', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      Geolocation.getGeolocation.should.have.been.called

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noGeolocation if there is no geolocation', ->
      errorKey = 'noGeolocation'
      expectedPromise = $q.reject errorKey
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject(errorKey)
      sandbox.spy ControllerPromiseHandler, 'handle'
      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should check get the group orders around the customer\'s position', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      GroupOrder.get.should.have.been.calledWithExactly positionMock.coords.latitude, positionMock.coords.longitude

    it 'should call ControllerPromiseHandler.handle with a rejected promise if it could not load group orders', ->
      expectedPromise = $q.reject()
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.reject()
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noGroupOrders if it loaded no group orders', ->
      expectedPromise = $q.reject 'noGroupOrders'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(emptyGroupOrdersMock)
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should get in the scope the groupOrders if there are more than one of them', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(groupOrdersMock)

      scope.onReload()
      scope.$digest()
      scope.groupOrders.should.deep.equal groupOrdersMock

    it 'should call ControllerPromiseHandler.handle with a resolved promise if it loaded some group orders', ->
      expectedPromise = $q.when()
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(groupOrdersMock)
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

  describe 'GroupOrdersCtrl#onJoinOrderTouch', ->

    it 'should check if the customer account is activated', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.defer().promise
      scope.onJoinOrderTouch groupOrderMock
      scope.$digest()
      Customer.checkActivatedAccount.should.have.been.called

    it 'should check for missing information if the customer account is activated', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub CustomerInformationChecker, 'check'

      scope.onJoinOrderTouch groupOrderMock
      scope.$digest()

      CustomerInformationChecker.check.should.have.been.called

    it 'should call Order.setCurrentOrder and change the state if the customer is activated and has provided all information', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.when({})
      sandbox.stub(CustomerInformationChecker, 'check').returns $q.when({})
      sandbox.spy(Order, 'setCurrentOrder')

      scope.onJoinOrderTouch groupOrderMock
      scope.$digest()

      Order.setCurrentOrder.should.have.been.called
      $state.go.should.have.been.calledWithExactly 'app.restaurant-menu',
        restaurantId: groupOrderMock.restaurant.data.id

  describe 'GroupOrdersCtrl#setArrayFromInt', ->

    it 'should return an Array filled whose length is the given parameter', ->
      input = 6
      scope.setArrayFromInt(input).length.should.equal input

    it 'should include only undefined values', ->
      input = 2
      output = scope.setArrayFromInt input
      expect(output[0]).to.be.undefined
      expect(output[1]).to.be.undefined

  describe 'GroupOrdersCtrl $on $ionicView.afterEnter', ->

    it 'should call onReload when receiving the event', ->
      sandbox.stub scope, 'onReload'
      scope.$broadcast '$ionicView.afterEnter'
      scope.onReload.should.have.been.called
