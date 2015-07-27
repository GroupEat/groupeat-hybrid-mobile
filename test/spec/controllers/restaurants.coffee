describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurants'
    module 'templates'

  rootScope = scope = $state = $httpBackend = ENV = sandbox = Customer = GroupOrder = Network = Order = Popup = Restaurant = Geolocation = $q = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      rootScope = $rootScope

      $q = $injector.get('$q')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      Customer = $injector.get('Customer')
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
      sandbox.stub(Customer, 'checkMissingInformation').returns $q.defer().promise

      scope.onRestaurantTouch 1
      scope.$digest()

      Customer.checkMissingInformation.should.have.been.called

    it 'should call GroupOrder#get if customer information are available', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(GroupOrder, 'get').returns $q.defer().promise

      scope.onRestaurantTouch 1
      scope.$digest()

      GroupOrder.get.should.have.been.called

    it 'should call Restaurant#checkGroupOrders when the group orders were fetched', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      groupOrders = []
      sandbox.stub GroupOrder, 'get', ->
        deferred = $q.defer()
        deferred.resolve(groupOrders)
        deferred.promise
      sandbox.stub(Restaurant, 'checkGroupOrders').returns $q.defer().promise

      restaurant =
        id: 1
      scope.onRestaurantTouch restaurant
      scope.$digest()

      Restaurant.checkGroupOrders.should.have.been.calledWithExactly(1, groupOrders)

    it 'should change the state to settings if all previous chains were resolved', ->
      sandbox.stub Customer, 'checkActivatedAccount', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub GroupOrder, 'get', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub Restaurant, 'checkGroupOrders', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise

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
      sandbox.spy(scope, '$broadcast')

    afterEach ->
      sandbox.restore()

    it 'should show an absence of connectivity message backdrop when there is no connectivity', ->
      errorKey = 'noNetwork'
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      sandbox.spy rootScope, '$broadcast'
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should broadcast scroll.refreshComplete when there is no connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject 'noNetwork'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a lack of geolocation permission message backdrop if the current position cannot be aquired', ->
      errorKey = 'noGeolocation'
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject errorKey
      sandbox.spy rootScope, '$broadcast'
      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', errorKey

    it 'should eventually broadcast scroll.refreshComplete if the current position cannot be aquired', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject 'noGeolocation'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should broadcast the displaying of a generic network failure message backdrop if the server cannot get the list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.reject()
      sandbox.spy rootScope, '$broadcast'
      scope.onReload()
      scope.$digest()
      Restaurant.getFromCoordinates.should.have.been.calledWithExactly(1, 1)
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', undefined

    it 'should eventually broadcast scroll.refreshComplete if the server cannot get the list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns($q.reject())
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should broadcast the displaying of a message backdrop when no restaurants are returned by the server', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when([])
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'displayMessageBackdrop', 'noRestaurants'

    it 'should broadcast the hiding of the message backdrop if at least one restaurant is returned by the server', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.when({})
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.when(currentPosition)
      sandbox.stub(Restaurant, 'getFromCoordinates').returns $q.when(['restaurant'])
      sandbox.spy rootScope, '$broadcast'

      scope.onReload()
      scope.$digest()
      rootScope.$broadcast.should.have.been.calledWithExactly 'hideMessageBackdrop'

    it 'should load restaurants in the scope if at least one is returned by the server', ->
      restaurants = ['firstRestaurant', 'secondRestaurant']
      sandbox.stub(Restaurant, 'getFromCoordinates', ->
        deferred = $q.defer()
        deferred.resolve(restaurants)
        return deferred.promise
      )
      scope.onReload()
      scope.$digest()
      scope.restaurants.should.equal(restaurants)

    it 'should eventually broadcast scroll.refreshComplete if the server returns a list of restaurants', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'getFromCoordinates', ->
        deferred = $q.defer()
        deferred.resolve(['restaurant'])
        return deferred.promise
      )
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')
