describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  scope = $q = $httpBackend = $mdDialog = $state = Customer = GroupOrder = Geolocation = LoadingBackdrop = MessageBackdrop = Network = Order = Popup = sandbox = ENV = $compile = {}

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
    },
    'remainingCapacity': 7
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
      LoadingBackdrop = $injector.get('LoadingBackdrop')
      MessageBackdrop = $injector.get('MessageBackdrop')
      Order = $injector.get('Order')
      Popup = $injector.get('Popup')
      Geolocation = $injector.get('Geolocation')
      $mdDialog = $injector.get('$mdDialog')
      GroupOrder = $injector.get('GroupOrder')
      Network = $injector.get('Network')

      $httpBackend = $injector.get('$httpBackend')

      scope = $rootScope.$new()

      $state = $injector.get('$state')
      sandbox.stub($state, 'go')
      $q = $injector.get('$q')
      $compile = $injector.get('$compile')

      sandbox.stub(Network, 'hasConnectivity').returns(false)
      GroupOrdersCtrl = $controller('GroupOrdersCtrl', {
        $mdDialog: $mdDialog, $scope: scope, $state: $state, Customer: Customer, Geolocation: Geolocation ,GroupOrder: GroupOrder, LoadingBackdrop: LoadingBackdrop, MessageBackdrop: MessageBackdrop, Network: Network, Order: Order, Popup: Popup, _: $injector.get('_')
      })
      ENV = $injector.get('ENV')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')


  cleanDialog = ->
    body = angular.element(document.body)
    dialogContainer = body[0].querySelector('.md-dialog-container')
    dialogElement = angular.element(dialogContainer)
    dialogElement.remove()
    scope.$digest()


  describe "Constructor", ->
    beforeEach ->
      scope.$digest()
      Network.hasConnectivity.restore()

    it 'should initialize groupOrders and isLoadingView variables (isLoadingView is a boolean which turns true when receive date from backend)', ->
      scope.groupOrders.should.be.empty

    it 'should refresh view', ->
      # TODO test if the method onRefreshGroupOrders is calling when GroupOrderCtrl

  describe 'GroupOrders#initCtrl', ->

    beforeEach ->
      scope.$digest()
      Network.hasConnectivity.restore()

    it 'should show a loading backdrop', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      scope.initCtrl()
      LoadingBackdrop.backdrop.should.have.been.calledWithExactly()

    it 'should call onRefreshGroupOrders', ->
      sandbox.stub(LoadingBackdrop, 'backdrop')
      sandbox.stub(scope, 'onRefreshGroupOrders', ->
        return $q.defer().promise
      )
      scope.initCtrl()
      scope.onRefreshGroupOrders.should.have.been.called

    it 'should remove the loading backdrop once the promise returned by onRefreshGroupOrders is rejected', ->
      sandbox.stub(LoadingBackdrop, 'noBackdrop')
      sandbox.stub(Network, 'hasConnectivity', ->
        return false
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.reject()
        return deferred.promise
      )
      scope.initCtrl()
      scope.$digest()
      LoadingBackdrop.noBackdrop.should.have.been.called

  describe "GroupOrders#onRefreshGroupOrders", ->

    beforeEach ->
      scope.$digest()
      Network.hasConnectivity.restore()
      
    it 'should check connectivity', ->
      callback = sandbox.stub(Network, 'hasConnectivity')
      scope.onRefreshGroupOrders()
      assert(callback.calledOnce)

    it 'should show backdrop message if no Network', ->
      sandbox.stub(Network, 'hasConnectivity').returns(false)
      callback = sandbox.stub(MessageBackdrop, 'noNetwork')
      scope.onRefreshGroupOrders().should.be.rejected
      assert(callback.calledOnce)

    it 'should NOT show backdrop message if Network', ->
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      callback = sandbox.stub(MessageBackdrop, 'noNetwork')
      scope.onRefreshGroupOrders()
      assert(callback.notCalled)

    it 'should check user current position', ->
      sandbox.spy(Geolocation, 'getGeolocation')
      # We make network working to test geolocation access
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      scope.onRefreshGroupOrders()
      Geolocation.getGeolocation.should.have.been.called

    it 'should show backdrop message if unable to access to user geolocation', ->
      sandbox.stub(Geolocation, 'getGeolocation').returns($q.reject())
      sandbox.stub(Network, 'hasConnectivity').returns(true)
      sandbox.stub(MessageBackdrop, 'noGeolocation')
      scope.onRefreshGroupOrders().should.be.rejected
      scope.$digest()
      MessageBackdrop.noGeolocation.should.have.been.calledOnce

    it 'should show NO geolocation backdrop message if able to access to user geolocation', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub(Geolocation, 'getGeolocation', () ->
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

    it 'should load groupOrders when network and UserCurrentPosition are available', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub(Geolocation, 'getGeolocation', () ->
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

      scope.onRefreshGroupOrders().should.be.fulfilled
      expect(scope.groupOrders).to.be.equal(groupOrderEmptyListMock)

    it 'should show a generic failure backdrop message if encountered pb loading groupOrders', ->
      sandbox.spy(MessageBackdrop, 'genericFailure')
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      # We make user location accessible
      sandbox.stub(Geolocation, 'getGeolocation', () ->
        deferred = $q.defer()
        deferred.resolve(positionMock)
        return deferred.promise
      )
      sandbox.stub(GroupOrder, 'get', (latitude, longitude) ->
        deferred = $q.defer()
        deferred.reject()
        return deferred.promise
      )
      scope.onRefreshGroupOrders()
      scope.$digest()
      scope.onRefreshGroupOrders().should.be.rejected

      MessageBackdrop.genericFailure.should.have.been.calledWithExactly('onRefreshGroupOrders()')

    it 'should show backdrop message if data is empty (no GroupOrder)', ->
      sandbox.stub(Network, 'hasConnectivity', () ->
        return true
      )
      sandbox.stub(Geolocation, 'getGeolocation', () ->
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
      scope.onRefreshGroupOrders().should.be.fulfilled

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
      sandbox.stub(Geolocation, 'getGeolocation', () ->
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
      scope.onRefreshGroupOrders().should.be.fulfilled

      expect(scope.messageBackdrop.show).to.be.equal(false)
      MessageBackdrop.noBackdrop.should.have.been.called

  describe 'GroupOrdersCtrl#getTimeDiff', ->

    it 'should return time between a mock date and actual date', ->
      endingAt = '2015-01-30 16:39:26'
      timeReturned = scope.getTimeDiff(endingAt)
      expect(timeReturned>=0).to.be.true
      expect(timeReturned>3895158).to.be.true

    it 'should return time in sec between two dates', ->

  describe 'GroupOrdersCtrl#onNewOrderTouch', ->

    it 'should open a generic failure dialog if we were unable to determine if customer information is missing', ->
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject())
      sandbox.stub(Popup, 'displayError')
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      Popup.displayError.should.have.been.calledWithExactly('genericFailureDetails', 3000)

    it 'should open a confirm dialog dialog if customer information are missing', ->
      # TODO : Test could be better (spying on the chained methods)
      sandbox.spy($mdDialog, 'confirm')
      missingPropertiesString =  'missingPropertiesString'
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject(missingPropertiesString))
      scope.onJoinOrderTouch(groupOrderMock)
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
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      $mdDialog.show.should.be.called
      $state.go.should.have.been.calledWithExactly('side-menu.settings')

    it 'should not change the state to settings if the user confirms the dialog', ->
      sandbox.stub($mdDialog, 'show').returns($q.reject())
      missingPropertiesString =  'missingPropertiesString'
      sandbox.stub(Customer, 'checkMissingInformation').returns($q.reject(missingPropertiesString))
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      $mdDialog.show.should.be.called
      $state.go.should.have.not.been.called

    it 'should set the current Order (service) when joining a groupOrder if no customer information are missing', ->
      sandbox.spy(Order, 'setCurrentOrder')
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      Order.setCurrentOrder.should.have.been.calledWithExactly(groupOrderMock.id, groupOrderMock.endingAt, groupOrderMock.discountRate, groupOrderMock.remainingCapacity)

    it 'should go to restaurant menu view corresponding to the selected groupOrder if no customer information are missing', ->
      sandbox.stub(scope, 'getTimeDiff').returns(1000)
      sandbox.stub(Customer, 'checkMissingInformation', ->
        deferred = $q.defer()
        deferred.resolve()
        return deferred.promise
      )
      scope.onJoinOrderTouch(groupOrderMock)
      scope.$digest()
      $state.go.should.have.been.calledWithExactly('restaurant-menu', {restaurantId: groupOrderMock.restaurant.data.id})

  describe 'GroupOrdersCtrl#onNewGroupOrder', ->

    it 'should go to the list of restaurants view on new order tap', ->
      scope.onNewGroupOrder()
      expect($state.current.name).to.not.equal('restaurants')
      $state.go.should.have.been.called
