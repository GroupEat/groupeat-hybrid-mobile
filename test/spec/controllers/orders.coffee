describe 'Ctrl: OrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.orders'
    module 'templates'

  scope = rootScope = $q = $state = $stateParams = Credentials = Network = Order = sandbox = {}

  ordersMock = ['firstOrder', 'secondOrder']

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      rootScope = $rootScope
      scope = $rootScope.$new()

      $q = $injector.get '$q'
      $state = $injector.get '$state'
      $stateParams = $injector.get '$stateParams'
      Credentials = $injector.get 'Credentials'
      Network = $injector.get 'Network'
      Order = $injector.get 'Order'

      OrdersCtrl = $controller('OrdersCtrl', {
        _: $injector.get('_'), $q: $q, $rootScope: rootScope, $scope: scope, $state: $state, $stateParams: $stateParams, Credentials: Credentials, Network: Network, Order: Order
      })
      $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond '{}'

  afterEach ->
    sandbox.restore()

  describe "OrdersCtrl#onReload", ->

    it 'should call Network.hasConnectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise

      scope.onReload()
      scope.$digest()

      Network.hasConnectivity.should.have.been.called

    it 'should broadcast the displaying of a no network message backdrop if there is no network', ->
      errorKey = 'noNetwork'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()

      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should call Order.queryForCustomer with the customer id if Network.hasConnectivity is resolved', ->
      expectedCustomerId = 1
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.defer().promise
      sandbox.stub(Credentials, 'get').returns
        id: expectedCustomerId

      scope.onReload()
      scope.$digest()

      Order.queryForCustomer.should.have.been.calledWithExactly expectedCustomerId

    it 'should broadcast the displaying of a noOrders message backdrop if there are no orders for the given customer', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when([])
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()

      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', 'noOrders'

    it 'should set scope.orders with the given orders if there are orders for the given customer', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when(ordersMock)
      sandbox.stub(Credentials, 'get').returns
        id: '1'

      scope.onReload()
      scope.$digest()

      scope.orders.should.equal ordersMock

    it 'should broadcast the hiding of the message backdrop if there are orders for the given customer', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Order, 'queryForCustomer').returns $q.when(ordersMock)
      sandbox.stub(Credentials, 'get').returns
        id: '1'
      sandbox.stub rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()

      rootScope.$broadcast.should.have.been.calledWithExactly 'hideMessageBackdrop'

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
