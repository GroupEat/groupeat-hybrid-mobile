describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurants'
    module 'templates'

  scope = $mdDialog = $state = $httpBackend = sandbox = Customer = MessageBackdrop = Network = Order = Popup = LoadingBackdrop = Restaurant = $geolocation = $q = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()

      $q = $injector.get('$q')
      $state = $injector.get('$state')
      sandbox.stub($state, 'go')

      Customer = $injector.get('Customer')
      Restaurant = $injector.get('Restaurant')
      MessageBackdrop = $injector.get('MessageBackdrop')
      LoadingBackdrop = $injector.get('LoadingBackdrop')
      Network = $injector.get('Network')
      _ = $injector.get('_')
      $geolocation = $injector.get('$geolocation')
      $mdDialog = $injector.get('$mdDialog')
      Popup = $injector.get('Popup')
      Order = $injector.get('Order')

      RestaurantsCtrl = $controller('RestaurantsCtrl', {
        $mdDialog: $mdDialog, $scope: scope, $state: $state, Customer: Customer, Restaurant: Restaurant, LoadingBackdrop: LoadingBackdrop, MessageBackdrop: MessageBackdrop, Network: Network, Order: Order, Popup: Popup, _: _, $geolocation: $geolocation
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

    it 'should open a generic failure dialog if we were unable to determine if customer information is missing', ->
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject())
      sandbox.stub(Popup, 'displayError')
      sandbox.stub(LoadingBackdrop, 'noBackdrop')
      scope.onRestaurantTouch(1)
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly('genericFailureDetails', 3000)

    it 'should open a confirm dialog dialog if customer information are missing', ->
      # TODO : Test could be better (spying on the chained methods)
      sandbox.spy($mdDialog, 'confirm')
      missingPropertiesString =  'missingPropertiesString'
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject(missingPropertiesString))
      scope.onRestaurantTouch(1)
      scope.$digest()
      $mdDialog.confirm.should.be.called

    it 'should change the state to settings if the user confirms the dialog', ->
      sandbox.stub($mdDialog, 'show', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      missingPropertiesString =  'missingPropertiesString'
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject(missingPropertiesString))
      scope.onRestaurantTouch(1)
      scope.$digest()
      $mdDialog.show.should.be.called
      $state.go.should.have.been.calledWithExactly('settings')

    it 'should not change the state to settings if the user confirms the dialog', ->
      sandbox.stub($mdDialog, 'show').returns($q.reject())
      missingPropertiesString =  'missingPropertiesString'
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject(missingPropertiesString))
      scope.onRestaurantTouch(1)
      scope.$digest()
      $mdDialog.show.should.be.called
      $state.go.should.have.not.been.called

    it 'should set currentOrder with correspond deliveryCapacity if there are no missing customer information', ->
      restaurant = { 'deliveryCapacity' : 5 }
      callback = sandbox.stub(Order, 'setCurrentOrder')
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onRestaurantTouch(restaurant)
      scope.$digest()
      assert(callback.calledWithExactly(null, null, null, restaurant.deliveryCapacity))

    it 'should change the state with the given restaurant id if there are no missing customer information', ->
      restaurant = { 'id' : 1 }
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onRestaurantTouch(restaurant)
      scope.$digest()
      $state.go.should.have.been.calledWithExactly('restaurant-menu', {restaurantId: restaurant.id})

  describe 'RestaurantsCtrl#initCtrl', ->

    it 'should show a loading backdrop', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      scope.initCtrl()
      LoadingBackdrop.backdrop.should.have.been.calledWithExactly()

    it 'should call onRefreshRestaurants', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      sandbox.stub(scope, 'onRefreshRestaurants').returns($q.defer().promise)
      scope.initCtrl()
      scope.onRefreshRestaurants.should.have.been.called

    it 'should remove the loading backdrop once the promise returned by onRefreshRestaurants is rejected', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      sandbox.stub(LoadingBackdrop, 'noBackdrop')
      sandbox.stub(scope, 'onRefreshRestaurants').returns($q.reject())
      scope.initCtrl()
      LoadingBackdrop.noBackdrop.should.have.not.been.called
      scope.$digest()
      LoadingBackdrop.noBackdrop.should.have.been.called

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
      scope.onRefreshRestaurants().should.be.rejected
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
      scope.onRefreshRestaurants().should.be.rejected
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
      scope.onRefreshRestaurants().should.be.rejected
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
      scope.onRefreshRestaurants().should.be.fulfilled
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
      scope.onRefreshRestaurants().should.be.fulfilled
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

    it 'should display logo placeholder if restaurant data from back does not have one', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub($geolocation, 'getCurrentPosition', ->
        deferred = $q.defer()
        deferred.resolve(currentPosition)
        return deferred.promise
      )
      restaurants = [{
        name :'firstRestaurant',
        logo : null,
        } ,{
        name : 'secondRestaurant',
        logo : 'there is something hein !',
        }]
      sandbox.stub(Restaurant, 'get', ->
        deferred = $q.defer()
        deferred.resolve(restaurants)
        return deferred.promise
      )
      scope.onRefreshRestaurants()
      scope.$digest()
      scope.restaurants[0].logo.should.equal('images/flat-pizza.png')
      scope.restaurants[1].logo.should.not.equal('images/flat-pizza.png')

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
