describe 'Ctrl: OrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.orders'
    module 'templates'

  scope = $q = $state = $stateParams = ControllerPromiseHandler = Credentials = Network = Order = sandbox = {}

  ordersMock = ['firstOrder', 'secondOrder']

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()

      $q = $injector.get '$q'
      $state = $injector.get '$state'
      $stateParams = $injector.get '$stateParams'
      ControllerPromiseHandler = $injector.get 'ControllerPromiseHandler'
      Credentials = $injector.get 'Credentials'
      Network = $injector.get 'Network'
      Order = $injector.get 'Order'

      OrdersCtrl = $controller('OrdersCtrl', {
        _: $injector.get('_'), $q: $q, $scope: scope, $state: $state, $stateParams: $stateParams, ControllerPromiseHandler: ControllerPromiseHandler, Credentials: Credentials, Network: Network, Order: Order
      })
      $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond '{}'

  afterEach ->
    sandbox.restore()

  describe "OrdersCtrl#onReload", ->

    beforeEach ->
      scope.initialState = 'initial'

    it 'should call Network.hasConnectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise

      scope.onReload()
      scope.$digest()

      Network.hasConnectivity.should.have.been.called

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noNetwork if there is no network', ->
      errorKey = 'noNetwork'
      expectedPromise = $q.reject errorKey
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()

      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should call Order.queryForCustomer with the customer id if Network.hasConnectivity is resolved', ->
      expectedCustomerId = 1
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.defer().promise
      sandbox.stub(Credentials, 'get').returns
        id: expectedCustomerId

      scope.onReload()
      scope.$digest()

      Order.queryForCustomer.should.have.been.calledWithExactly expectedCustomerId

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noOrders if there are no orders for the given customer', ->
      expectedPromise = $q.reject 'noOrders'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when([])
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()

      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should set scope.orders with the given orders if there are orders for the given customer', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when(ordersMock)
      sandbox.stub(Credentials, 'get').returns
        id: '1'

      scope.onReload()
      scope.$digest()

      scope.orders.should.equal ordersMock

    it 'should call ControllerPromiseHandler.handle with a resolved promise if there are orders for the given customer', ->
      expectedPromise = $q.when()
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when(ordersMock)
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()

      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should broadcast the scroll.refreshComplete at the end of the promise chain', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when(ordersMock)
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.stub scope, '$broadcast'

      scope.onReload()
      scope.$digest()

      scope.$broadcast.should.have.been.calledWithExactly 'scroll.refreshComplete'

  describe 'OrdersCtrl#getTimeDiff', ->

    it 'should call Order.getTimeDiff with the given parameter', ->
      endingAt = 'time'
      timeDiff = 'timeDiff'
      sandbox.stub(Order, 'getTimeDiff').returns timeDiff
      scope.getTimeDiff(endingAt).should.equal timeDiff

  describe 'OrdersCtrl $on $ionicView.afterEnter', ->

    it 'should call onReload when receiving the event', ->
      sandbox.stub scope, 'onReload'
      scope.$broadcast '$ionicView.afterEnter'
      scope.onReload.should.have.been.called
