describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurants'
    module 'templates'

  scope = $state = $httpBackend = ENV = sandbox = ControllerPromiseHandler = Customer = CustomerInformationChecker = GroupOrder = Network = Order = Popup = Restaurant = Geolocation = $q = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()

      $q = $injector.get('$q')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      ControllerPromiseHandler = $injector.get 'ControllerPromiseHandler'
      Customer = $injector.get('Customer')
      CustomerInformationChecker = $injector.get 'CustomerInformationChecker'
      Restaurant = $injector.get('Restaurant')
      GroupOrder = $injector.get('GroupOrder')
      Network = $injector.get('Network')
      _ = $injector.get('_')
      Geolocation = $injector.get('Geolocation')
      Popup = $injector.get('Popup')
      Order = $injector.get('Order')
      ENV = $injector.get('ENV')

      RestaurantsCtrl = $controller('RestaurantsCtrl', {
        $scope: scope, $state: $state, Customer: Customer, GroupOrder: GroupOrder, Restaurant: Restaurant, Network: Network, Order: Order, Popup: Popup, _: _, Geolocation: Geolocation
      })
      $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    it 'restaurants should initially be empty', ->
      scope.restaurants.should.be.empty

    it 'refreshRestaurants should initially be called', ->
      # TODO

  describe 'RestaurantsCtrl#onRestaurantTouch', ->

    beforeEach ->
      scope.userCurrentPosition =
        coords:
          latitude: 1
          longitude: 1

    it 'should check if the customer account is activated', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.defer().promise
      scope.onRestaurantTouch 1
      scope.$digest()
      Customer.checkActivatedAccount.should.have.been.called

    it 'should check for missing information is the customer account is activated', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(CustomerInformationChecker, 'check').returns $q.defer().promise

      scope.onRestaurantTouch 1
      scope.$digest()

      CustomerInformationChecker.check.should.have.been.called

    it 'should call GroupOrder#get if customer information are available', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.when({})
      sandbox.stub(CustomerInformationChecker, 'check').returns $q.when({})
      sandbox.stub(GroupOrder, 'get').returns $q.defer().promise

      scope.onRestaurantTouch 1
      scope.$digest()

      GroupOrder.get.should.have.been.called

    it 'should call Restaurant#checkGroupOrders when the group orders were fetched', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.when({})
      sandbox.stub(CustomerInformationChecker, 'check').returns $q.when({})
      groupOrders = []
      sandbox.stub(GroupOrder, 'get').returns $q.when(groupOrders)
      sandbox.stub(Restaurant, 'checkGroupOrders').returns $q.defer().promise

      restaurant =
        id: 1
      scope.onRestaurantTouch restaurant
      scope.$digest()

      Restaurant.checkGroupOrders.should.have.been.calledWithExactly(1, groupOrders)

    it 'should change the state to settings if all previous chains were resolved', ->
      sandbox.stub(Customer, 'checkActivatedAccount').returns $q.when({})
      sandbox.stub(CustomerInformationChecker, 'check').returns $q.when({})
      sandbox.stub(GroupOrder, 'get').returns $q.when({})
      sandbox.stub(Restaurant, 'checkGroupOrders').returns $q.when()

      sandbox.spy(Order, 'setCurrentOrder')

      restaurant =
        deliveryCapacity: 10
        discountPolicy: 'discountPolicy'
        id: 1
      scope.onRestaurantTouch restaurant
      scope.$digest()

      Order.setCurrentOrder.should.have.been.calledWithExactly(null, null, 0, 10, 'discountPolicy')
      $state.go.should.have.been.calledWithExactly('app.restaurant-menu', restaurantId: 1)

  describe 'RestaurantsCtrl#onReload', ->

    currentPosition =
      coords:
        latitude: 1
        longitude: 1

    beforeEach ->
      scope.initialState = 'initial'
      sandbox.spy(scope, '$broadcast')

    afterEach ->
      sandbox.restore()

    it 'should show an absence of connectivity message backdrop when there is no connectivity', ->
      errorKey = 'noNetwork'
      expectedPromise = $q.reject errorKey
      sandbox.spy ControllerPromiseHandler, 'handle'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should broadcast scroll.refreshComplete when there is no connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject 'noNetwork'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a lack of geolocation permission message backdrop if the current position cannot be aquired', ->
      errorKey = 'noGeolocation'
      expectedPromise = $q.reject errorKey
      sandbox.spy ControllerPromiseHandler, 'handle'
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject errorKey
      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should eventually broadcast scroll.refreshComplete if the current position cannot be aquired', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject 'noGeolocation'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should call ControllerPromiseHandler.handle with a rejected promise if the server cannot get the list of restaurants', ->
      expectedPromise = $q.reject()
      sandbox.spy ControllerPromiseHandler, 'handle'
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.reject()
      scope.onReload()
      scope.$digest()
      Restaurant.getFromCoordinates.should.have.been.calledWithExactly(1, 1)
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should eventually broadcast scroll.refreshComplete if the server cannot get the list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns($q.reject())
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should call ControllerPromiseHandler.handle with a promise rejected with noRestaurants when no restaurants are returned by the server', ->
      expectedPromise = $q.reject('noRestaurants')
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when([])
      sandbox.spy ControllerPromiseHandler, 'handle'

      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should call ControllerPromiseHandler.handle with a resolved promise if at least one restaurant is returned by the server', ->
      expectedPromise = $q.when()
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when(['restaurant'])
      sandbox.spy ControllerPromiseHandler, 'handle'
      scope.onReload()
      scope.$digest()
      ControllerPromiseHandler.handle.should.have.been.calledWithMatch expectedPromise, 'initial'

    it 'should load restaurants in the scope if at least one is returned by the server', ->
      restaurants = ['firstRestaurant', 'secondRestaurant']
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when(restaurants)
      scope.onReload()
      scope.$digest()
      scope.restaurants.should.equal(restaurants)

    it 'should eventually broadcast scroll.refreshComplete if the server returns a list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when(['restaurant'])
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

  describe 'RestaurantsCtrl $on $ionicView.afterEnter', ->

    it 'should call onReload when receiving the event', ->
      sandbox.stub scope, 'onReload'
      scope.$broadcast '$ionicView.afterEnter'
      scope.onReload.should.have.been.called
