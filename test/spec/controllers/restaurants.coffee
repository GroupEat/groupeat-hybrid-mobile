describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurants'
    module 'templates'

  scope = $state = $httpBackend = sandbox = MessageBackdrop = Network = Restaurant = $geolocation = $q = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()

      $q = $injector.get('$q')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      Restaurant = $injector.get('Restaurant')
      MessageBackdrop = $injector.get('MessageBackdrop')
      Network = $injector.get('Network')
      _ = $injector.get('_')
      $geolocation = $injector.get('$geolocation')

      RestaurantsCtrl = $controller('RestaurantsCtrl', {
        $scope: scope, $state: $state, Restaurant: Restaurant, MessageBackdrop: MessageBackdrop, Network: Network, _: _, $geolocation: $geolocation
        })
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  beforeEach ->
    scope.$apply()

  describe 'Constructor', ->

    it 'restaurants should initially be empty', ->
      scope.restaurants.should.be.empty

    it 'refreshRestaurants should initially be called', ->
      # TODO

  describe 'RestaurantsCtrl#onRestaurantTouch', ->

    it 'should change the state with the given restaurant id', ->
      id = 1
      scope.onRestaurantTouch(id)
      $state.go.should.have.been.calledWithExactly('restaurant-menu', {restaurantId: id})

  describe 'RestaurantsCtrl#onRefreshRestaurants', ->

    currentPosition =
      coords:
        latitude: 1
        longitude: 1

    beforeEach ->
      sandbox.spy(scope, '$broadcast')

    it 'should show an absence of connectivity message backdrop when there is no connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns(false)
      sandbox.spy(MessageBackdrop, 'noNetwork')
      scope.onRefreshRestaurants()
      messageBackdrop = MessageBackdrop.noNetwork()
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should broadcast scroll.refreshComplete when there is no connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns(false)
      scope.onRefreshRestaurants()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a lack of geolocation permission message backdrop if the current position cannot be aquired', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition').returns($q.reject())
      sandbox.spy(MessageBackdrop, 'noGeolocation')
      scope.onRefreshRestaurants()
      scope.$digest()
      messageBackdrop = MessageBackdrop.noGeolocation()
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should eventually broadcast scroll.refreshComplete if the current position cannot be aquired', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition').returns($q.reject())
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a generic network failure message backdrop if the server cannot get the list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get').returns($q.reject())
      scope.onRefreshRestaurants()
      scope.$digest()
      Restaurant.get.should.have.been.calledWithExactly(1, 1)
      messageBackdrop = MessageBackdrop.genericFailure('onRefreshRestaurants()')
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should eventually broadcast scroll.refreshComplete if the server cannot get the list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get').returns($q.reject())
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a message backdrop when no restaurants are returned by the server', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve([])
        return deferred.promise
      )
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.messageBackdrop.show.should.be.true
      scope.messageBackdrop.title.should.equal('noRestaurantsTitle')
      scope.messageBackdrop.details.should.equal('noRestaurantsDetails')
      scope.messageBackdrop.iconClasses.should.equal('ion-android-restaurant')
      scope.messageBackdrop.button.text.should.equal('reload')
      scope.messageBackdrop.button.action.should.equal('onRefreshRestaurants()')

    it 'should not show any backdrop if at least one restaurant is returned by the server', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(['restaurant'])
        return deferred.promise
      )
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.messageBackdrop.show.should.be.false

    it 'should load restaurants in the scope if at least one is returned by the server', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      restaurants = ['firstRestaurant', 'secondRestaurant']
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(restaurants)
        return deferred.promise
      )
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.restaurants.should.equal(restaurants)

    it 'should eventually broadcast scroll.refreshComplete if the server returns a list of restaurants', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(['restaurant'])
        return deferred.promise
      )
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')
