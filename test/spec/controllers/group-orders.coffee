describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  scope = $q = $httpBackend = $state = Customer = GroupOrder = MessageBackdrop = Network = Order = Popup = $geolocation = sandbox = ENV = $compile = {}

  positionMock = {
    'coords': {
      'latitude': 48,
      'longitude': 2
    }
  }

  groupOrderMock = {
    'id': '11',
    'endingAt': '2015-01-30 16:39:26',
    'discountRate': 24,
    'restaurant': {
      'data': {
        'id': 5
      }
    }
  }

  groupOrderEmptyListMock = {
    'data': {}
  }

  groupOrderNotEmptyListMock = {
    'data': {'someData'}
  }

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->

      sandbox = sinon.sandbox.create()

      Customer = $injector.get('Customer')
      MessageBackdrop = $injector.get('MessageBackdrop')
      Order = $injector.get('Order')
      Popup = $injector.get('Popup')
      $geolocation = $injector.get('$geolocation')
      GroupOrder = $injector.get('GroupOrder')
      Network = $injector.get('Network')

      $httpBackend = $injector.get('$httpBackend')

      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')
      $q = $injector.get('$q')
      $compile = $injector.get('$compile')

      GroupOrdersCtrl = $controller('GroupOrdersCtrl', {
        $scope: scope, $state: $state, $mdDialog: $injector.get('$mdDialog'), Customer: Customer, GroupOrder: GroupOrder, MessageBackdrop: MessageBackdrop, Network: Network, Order: Order, Popup: Popup, $geolocation: $geolocation, _: $injector.get('_')
      })
      sandbox.spy(scope, 'onRefreshGroupOrders')
      ENV = $injector.get('ENV')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()

  beforeEach ->
    scope.$apply()

  describe "Constructor", ->

    it 'should initialize groupOrders and isLoadingView variables (isLoadingView is a boolean which turns true when receive date from backend)', ->
      scope.groupOrders.should.be.empty

    it 'should refresh view', ->
      # It would be nice to test if the method onRefreshGroupOrders is calling when GroupOrderCtrl

  describe "Refreshing the view", ->

    it 'should check connectivity', ->
      callback = sandbox.stub(Network, 'hasConnectivity')
      scope.onRefreshGroupOrders()
      assert(callback.calledOnce)

    it 'should show backdrop message if no Network', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return false
      )
      callback = sandbox.stub(MessageBackdrop, 'noNetwork')
      scope.onRefreshGroupOrders()
      assert(callback.calledOnce)

    it 'should NOT show backdrop message if Network', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      callback = sandbox.stub(MessageBackdrop, 'noNetwork')
      scope.onRefreshGroupOrders()
      assert(callback.notCalled)

    it 'should check user current position', ->
      sandbox.spy($geolocation, 'getCurrentPosition')
      # We make network working to test geolocation access
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      scope.onRefreshGroupOrders()
      $geolocation.getCurrentPosition.should.have.been.called


    it 'should show backdrop message if unable to access to user geolocation', ->
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.reject('cest le bordel...')
        return deferred.promise
      )
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      sandbox.stub(MessageBackdrop, 'noGeolocation')
      scope.onRefreshGroupOrders()
      scope.$apply()
      MessageBackdrop.noGeolocation.should.have.been.calledOnce

    it 'should show NO geolocation backdrop message and set UserCurrentPosition if able to access to user geolocation', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.resolve(groupOrderEmptyListMock)
        return deferred.promise
      )

      # as we made user geolocation accessible, a request will follow (GroupOrders.get)
      sandbox.spy(MessageBackdrop, 'noGeolocation')
      scope.onRefreshGroupOrders()
      scope.$apply()

      MessageBackdrop.noGeolocation.should.not.have.been.called
      expect(scope.userCurrentPosition).to.be.equal(positionMock)

    it 'should load groupOrders when network and UserCurrentPosition are available', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.resolve(groupOrderEmptyListMock)
        return deferred.promise
      )
      $httpBackend.expectGET(ENV.apiEndpoint+'/groupOrders?joinable=1&around=1&latitude=48&longitude=2&include=restaurant').respond(groupOrderEmptyListMock)
      scope.onRefreshGroupOrders()
      scope.$digest()

      expect(scope.groupOrders).to.be.equal(groupOrderEmptyListMock)

    it 'should show a generic failure backdrop message if encountered pb loading groupOrders', ->
      sandbox.spy(MessageBackdrop, 'genericFailure')
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.reject()
        return deferred.promise
      )
      $httpBackend.expectGET(ENV.apiEndpoint+'/groupOrders?joinable=1&around=1&latitude=48&longitude=2&include=restaurant').respond(groupOrderEmptyListMock)
      scope.onRefreshGroupOrders()
      scope.$digest()

      MessageBackdrop.genericFailure.should.have.been.calledWithExactly('onRefreshGroupOrders()')


    it 'should call LoadingBackdrop.noBackdrop when receive data from backend', ->
      ### sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.resolve(groupOrderEmptyListMock)
        return deferred.promise
      )
      $httpBackend.expectGET(ENV.apiEndpoint+'/groupOrders?joinable=1&around=1&latitude=48&longitude=2&include=restaurant').respond(groupOrderEmptyListMock)
      scope.onRefreshGroupOrders()
      scope.$digest()###

    it 'should show backdrop message if data is empty (no GroupOrder)', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.resolve(groupOrderEmptyListMock.data)
        return deferred.promise
      )

      scope.onRefreshGroupOrders()
      scope.$digest()

      expect(scope.messageBackdrop.show).to.be.equal(true)
      expect(scope.messageBackdrop.title).to.be.equal('noGroupOrdersTitle')
      expect(scope.messageBackdrop.details).to.be.equal('noGroupOrdersDetails')
      expect(scope.messageBackdrop.iconClasses).to.be.equal('ion-ios-cart-outline')
      expect(scope.messageBackdrop.button.text).to.be.equal('newOrder')
      expect(scope.messageBackdrop.button.action).to.be.equal('onNewGroupOrder()')

    it 'should NOT show backdrop message if any groupOrder', ->
      sandbox.spy(MessageBackdrop, 'noBackdrop')
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub($geolocation, 'getCurrentPosition', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.resolve(groupOrderNotEmptyListMock.data)
        return deferred.promise
      )
      scope.onRefreshGroupOrders()
      scope.$digest()

      expect(scope.messageBackdrop.show).to.be.equal(false)
      MessageBackdrop.noBackdrop.should.have.been.called

  describe "Other ctrl methods", ->

    it 'should return time between a mock date and actual date', ->
      endingAt = '2015-01-30 16:39:26'
      timeReturned = scope.getTimeDiff(endingAt)
      expect(timeReturned>=0).to.be.true
      expect(timeReturned>3895158).to.be.true

    it 'should return time in sec between two dates', ->

    it 'should set the current Order (service) when joining a groupOrder', ->
      sandbox.spy(Order, 'setCurrentOrder')
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      Order.setCurrentOrder.should.have.been.calledWithExactly(groupOrderMock.id, groupOrderMock.endingAt, groupOrderMock.discountRate)

    it 'should go to restaurant menu view corresponding to the selected groupOrder', ->
      sandbox.stub(scope, 'getTimeDiff').returns(1000)
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()

      $state.go.should.have.been.calledWithExactly('restaurant-menu', {restaurantId: groupOrderMock.restaurant.data.id})

    it 'should go to the list of restaurants view on new order tap', ->
      scope.onNewGroupOrder()
      expect($state.current.name).to.not.equal('restaurants')
      $state.go.should.have.been.called
