describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  scope = rootScope = $q = $httpBackend = $state = Customer = GroupOrder = Geolocation = Network = Order = sandbox = ENV = $compile = {}

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

      Customer = $injector.get('Customer')
      Order = $injector.get('Order')
      Geolocation = $injector.get('Geolocation')
      GroupOrder = $injector.get('GroupOrder')
      Network = $injector.get('Network')

      $httpBackend = $injector.get('$httpBackend')

      rootScope = $rootScope
      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')
      $q = $injector.get('$q')
      $compile = $injector.get('$compile')

      GroupOrdersCtrl = $controller('GroupOrdersCtrl', {
        $scope: scope, $state: $state, Customer: Customer, Geolocation: Geolocation, GroupOrder: GroupOrder, Network: Network, Order: Order, _: $injector.get('_')
      })
      ENV = $injector.get('ENV')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  describe "GroupOrders#onReload", ->

    it 'should check connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise
      scope.onReload()
      Network.hasConnectivity.should.have.been.called

    it 'should broadcast the displaying of a no network message backdrop if there is no network', ->
      errorKey = 'noNetwork'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      sandbox.spy rootScope, '$broadcast'
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should check user current position', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      Geolocation.getGeolocation.should.have.been.called

    it 'should broadcast the displaying of a no geolocation message backdrop if there is no geolocation', ->
      errorKey = 'noGeolocation'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject(errorKey)
      sandbox.spy rootScope, '$broadcast'
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should check get the group orders around the customer\'s position', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      GroupOrder.get.should.have.been.calledWithExactly positionMock.coords.latitude, positionMock.coords.longitude

    it 'should broadcast the displaying of a backdrop message if it could not load group orders', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.reject()
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', undefined

    it 'should broadcast the displaying of no group orders backdrop message if it loaded no group orders', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(emptyGroupOrdersMock)
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', 'noGroupOrders'

    it 'should get in the scope the groupOrders if there are more than one of them', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(groupOrdersMock)

      scope.onReload()
      scope.$digest()
      scope.groupOrders.should.deep.equal groupOrdersMock

    it 'should broadcast the hiding of the message backdrop if it loaded some group orders', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(positionMock)
      sandbox.stub(GroupOrder, 'get').returns $q.when(groupOrdersMock)
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'hideMessageBackdrop'

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
      sandbox.stub Customer, 'checkMissingInformation'

      scope.onJoinOrderTouch groupOrderMock
      scope.$digest()

      Customer.checkMissingInformation.should.have.been.called

    it 'should call Order.setCurrentOrder and change the state if the customer is activated and has provided all information', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.spy(Order, 'setCurrentOrder')

      scope.onJoinOrderTouch groupOrderMock
      scope.$digest()

      Order.setCurrentOrder.should.have.been.called
      $state.go.should.have.been.calledWithExactly 'app.restaurant-menu',
        restaurantId: groupOrderMock.restaurant.data.id
