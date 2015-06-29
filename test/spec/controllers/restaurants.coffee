describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurants'
    module 'templates'

  scope = $mdDialog = $state = $httpBackend = ENV = sandbox = Customer = GroupOrder = MessageBackdrop = Network = Order = Popup = LoadingBackdrop = Restaurant = Geolocation = $q = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()

      $q = $injector.get('$q')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      Customer = $injector.get('Customer')
      Restaurant = $injector.get('Restaurant')
      GroupOrder = $injector.get('GroupOrder')
      MessageBackdrop = $injector.get('MessageBackdrop')
      LoadingBackdrop = $injector.get('LoadingBackdrop')
      Network = $injector.get('Network')
      _ = $injector.get('_')
      Geolocation = $injector.get('Geolocation')
      $mdDialog = $injector.get('$mdDialog')
      Popup = $injector.get('Popup')
      Order = $injector.get('Order')
      ENV = $injector.get('ENV')

      sandbox.stub(Network, 'hasConnectivity').returns(false)
      RestaurantsCtrl = $controller('RestaurantsCtrl', {
        $mdDialog: $mdDialog, $scope: scope, $state: $state, Customer: Customer, GroupOrder: GroupOrder, Restaurant: Restaurant, LoadingBackdrop: LoadingBackdrop, MessageBackdrop: MessageBackdrop, Network: Network, Order: Order, Popup: Popup, _: _, Geolocation: Geolocation
        })
      $httpBackend = $injector.get('$httpBackend')

      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  beforeEach ->
    scope.$digest()
    Network.hasConnectivity.restore()

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

      Order.setCurrentOrder.should.have.been.calledWithExactly(null, null, null, 10, 'discountPolicy')
      $state.go.should.have.been.calledWithExactly('restaurant-menu', restaurantId: 1)

  describe 'RestaurantsCtrl#initCtrl', ->

    it 'should show a loading backdrop', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      scope.initCtrl()
      LoadingBackdrop.backdrop.should.have.been.calledWithExactly()

    it 'should call onReload', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      sandbox.stub(scope, 'onReload').returns $q.defer().promise
      scope.initCtrl()
      scope.onReload.should.have.been.called

    it 'should remove the loading backdrop once the promise returned by onReload is rejected', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      sandbox.stub(LoadingBackdrop, 'noBackdrop')
      sandbox.stub(scope, 'onReload').returns($q.reject())
      scope.initCtrl()
      LoadingBackdrop.noBackdrop.should.have.not.been.called
      scope.$digest()
      LoadingBackdrop.noBackdrop.should.have.been.called

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
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject 'noNetwork'
      scope.onReload().should.be.rejected
      scope.$digest()
      messageBackdrop = MessageBackdrop.backdropFromErrorKey 'noNetwork'
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should broadcast scroll.refreshComplete when there is no connectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject 'noNetwork'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a lack of geolocation permission message backdrop if the current position cannot be aquired', ->
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject 'noGeolocation'
      scope.onReload().should.be.rejected
      scope.$digest()
      scope.messageBackdrop.should.deep.equal(MessageBackdrop.backdropFromErrorKey 'noGeolocation')

    it 'should eventually broadcast scroll.refreshComplete if the current position cannot be aquired', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation').returns $q.reject 'noGeolocation'
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a generic network failure message backdrop if the server cannot get the list of restaurants', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get').returns($q.reject())
      scope.onReload().should.be.rejected
      scope.$digest()
      Restaurant.get.should.have.been.calledWithExactly(1, 1)
      messageBackdrop = MessageBackdrop.backdropFromErrorKey()
      scope.messageBackdrop.should.deep.equal(messageBackdrop)

    it 'should eventually broadcast scroll.refreshComplete if the server cannot get the list of restaurants', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get').returns($q.reject())
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')

    it 'should show a message backdrop when no restaurants are returned by the server', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve([])
        return deferred.promise
      )
      scope.onReload().should.be.fulfilled
      scope.$digest()
      scope.messageBackdrop.show.should.be.true
      scope.messageBackdrop.title.should.equal('noRestaurantsTitle')
      scope.messageBackdrop.details.should.equal('noRestaurantsDetails')
      scope.messageBackdrop.iconClasses.should.equal('ion-android-restaurant')
      scope.messageBackdrop.button.text.should.equal('reload')
      scope.messageBackdrop.button.action.should.equal('onReload()')

    it 'should not show any backdrop if at least one restaurant is returned by the server', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(['restaurant'])
        return deferred.promise
      )
      scope.onReload().should.be.fulfilled
      scope.$digest()
      scope.messageBackdrop.show.should.be.false

    it 'should load restaurants in the scope if at least one is returned by the server', ->
      sandbox.stub Network, 'hasConnectivity', ->
        deferred = $q.defer()
        deferred.resolve()
        deferred.promise
      sandbox.stub(Geolocation, 'getGeolocation', ->
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
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(['restaurant'])
        return deferred.promise
      )
      scope.onReload()
      scope.$digest()
      scope.$broadcast.should.have.been.calledWithExactly('scroll.refreshComplete')
