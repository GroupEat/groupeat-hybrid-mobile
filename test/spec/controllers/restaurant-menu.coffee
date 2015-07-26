describe 'Ctrl: RestaurantMenuCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurant-menu'
    module 'groupeat.controllers.cart'
    module 'templates'

  sandbox = ctrl = $ionicHistory = $ionicModal = $ionicScrollDelegate = $ionicSlideBoxDelegate = $q = scope = $stateParams = Cart = MessageBackdrop = Network = Order = Popup = Product = Restaurant = {}

  mockProduct = {}
  mockFormat = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()

      scope = $rootScope.$new()
      $ionicHistory = $injector.get '$ionicHistory'
      $ionicModal = $injector.get '$ionicModal'
      $ionicScrollDelegate = $injector.get '$ionicScrollDelegate'
      $ionicSlideBoxDelegate = $injector.get '$ionicSlideBoxDelegate'
      $q = $injector.get '$q'
      $stateParams = $injector.get '$stateParams'
      Cart = $injector.get 'Cart'
      MessageBackdrop = $injector.get 'MessageBackdrop'
      Network = $injector.get 'Network'
      Order = $injector.get 'Order'
      Popup = $injector.get 'Popup'
      Product = $injector.get 'Product'
      Restaurant = $injector.get 'Restaurant'

      ctrl = $controller('RestaurantMenuCtrl', (_: $injector.get('_'), $ionicHistory: $ionicHistory, $ionicModal: $ionicModal, $ionicScrollDelegate: $ionicScrollDelegate, $ionicSlideBoxDelegate: $ionicSlideBoxDelegate, $q: $q, $scope: scope, $stateParams: $stateParams, $timeout: $injector.get('$timeout'), Analytics: $injector.get('Analytics'), Cart: Cart, MessageBackdrop: MessageBackdrop, Network: Network, Popup: Popup, Product: Product, Restaurant: Restaurant))

  afterEach ->
    sandbox.restore()

  describe 'RestaurantMenu#initCtrl', ->

    it 'should create an empty cart', ->
      sandbox.stub scope, 'onReload'
      scope.initCtrl()
      expect(scope.cart).not.to.equal null
      scope.cart.should.have.property 'getTotalPrice'
      scope.cart.should.have.property 'getTotalQuantity'
      scope.cart.should.have.property 'getProducts'
      expect(_.isEmpty(scope.cart.getProducts())).to.be.true

    it 'should call onReload', ->
      sandbox.stub scope, 'onReload'
      scope.initCtrl()
      scope.onReload.should.have.been.called

  describe 'RestaurantMenu#onReload', ->

    it 'should call Network.hasConnectivity', ->
      sandbox.stub(Network, 'hasConnectivity').returns $q.defer().promise
      scope.onReload()
      scope.$digest()
      Network.hasConnectivity.should.have.been.called

    it 'should return a MessageBackdrop with the error key from hasConnectivity when the promise is rejected', ->
      errorKey = 'noNetwork'
      messageBackdrop = MessageBackdrop.backdropFromErrorKey errorKey
      sandbox.stub(Network, 'hasConnectivity').returns $q.reject(errorKey)
      scope.onReload()
      scope.$digest()
      scope.messageBackdrop.should.deep.equal messageBackdrop

  describe 'RestaurantMenu#onAddProduct', ->

    beforeEach ->
      scope.initCtrl()

    it 'should call Popup.error with tooManyProducts if there are too many products in the Cart', ->
      sandbox.stub Popup, 'error'
      scope.currentOrder.remainingCapacity = scope.cart.getTotalQuantity()
      scope.onAddProduct(mockProduct, mockFormat)
      Popup.error.should.have.been.calledWithExactly 'tooManyProducts'

    it 'should call Cart.addProduct if there are enough products in the Cart', ->
      sandbox.stub Cart, 'addProduct'
      scope.currentOrder.remainingCapacity = scope.cart.getTotalQuantity() + 1
      scope.onAddProduct mockProduct, mockFormat
      Cart.addProduct.should.have.been.calledWithExactly mockProduct, mockFormat

    it 'should call Order.updateCurrentDiscount if there are enough products in the Cart', ->
      sandbox.stub Order, 'updateCurrentDiscount'
      scope.currentOrder.remainingCapacity = scope.cart.getTotalQuantity() + 1
      scope.onAddProduct mockProduct, mockFormat
      totalPrice = scope.cart.getTotalPrice()
      Order.updateCurrentDiscount.should.have.been.calledWithExactly totalPrice

  describe 'RestaurantMenu#onDeleteProduct', ->

    beforeEach ->
      scope.initCtrl()

    it 'should call Cart.removeProduct', ->
      sandbox.stub Cart, 'removeProduct'
      scope.onDeleteProduct mockProduct, mockFormat
      Cart.removeProduct.should.have.been.calledWithExactly mockProduct, mockFormat

    it 'should call Cart.removeProduct', ->
      sandbox.stub Order, 'updateCurrentDiscount'
      scope.onDeleteProduct mockProduct, mockFormat
      totalPrice = scope.cart.getTotalPrice()
      Order.updateCurrentDiscount.should.have.been.calledWithExactly totalPrice

  describe 'RestaurantMenu#toggleDetails', ->

    beforeEach ->
      scope.initCtrl()

    it 'should set detailedProduct to null if scope.areDetailsShown is true', ->
      sandbox.stub(scope, 'areDetailsShown').returns true
      scope.toggleDetails mockProduct
      expect(scope.detailedProduct).to.be.null

    it 'should assign the given product in parameters if scope.areDetailsShown is false', ->
      sandbox.stub(scope, 'areDetailsShown').returns false
      scope.toggleDetails mockProduct
      scope.detailedProduct.should.deep.equal mockProduct

  describe 'RestaurantMenu#areDetailsShown', ->

    beforeEach ->
      scope.initCtrl()

    it 'should return true if scope.detailedProduct equals the product given in parameter', ->
      scope.detailedProduct = mockProduct
      scope.areDetailsShown(mockProduct).should.be.true

    it 'should return false if scope.detailedProduct does not equal the product given in parameter', ->
      scope.detailedProduct = {}
      scope.areDetailsShown(mockProduct).should.be.false

  describe 'RestaurantMenu#onLeaveRestaurant with an empty cart', ->

    beforeEach ->
      sandbox.stub scope, 'onReload'
      scope.initCtrl()
      scope.cart.setProducts []

    it 'should call reset the Cart, the current order and call $ionicHistory.goBack if the Popup.confirm is resoved with a true value', ->
      sandbox.stub Order, 'resetCurrentOrder'
      sandbox.stub $ionicHistory, 'goBack'
      scope.onLeaveRestaurant()
      scope.$digest()
      Order.resetCurrentOrder.should.have.been.called
      $ionicHistory.goBack.should.have.been.called

  describe 'RestaurantMenu#onLeaveRestaurant with a non-empty cart', ->

    beforeEach ->
      sandbox.stub scope, 'onReload'
      scope.initCtrl()
      scope.cart.setProducts ['first', 'second']

    it 'should call Popup.confirm', ->
      sandbox.stub(Popup, 'confirm').returns $q.defer().promise
      scope.onLeaveRestaurant()
      scope.$digest()
      Popup.confirm.should.have.been.calledWithExactly 'leaveOrder', 'cartWillBeDestroyed'

    it 'should call reset the Cart, the current order and call $ionicHistory.goBack if the Popup.confirm is resoved with a true value', ->
      sandbox.stub Cart, 'reset'
      sandbox.stub Order, 'resetCurrentOrder'
      sandbox.stub $ionicHistory, 'goBack'
      sandbox.stub Popup, 'confirm', ->
        deferred = $q.defer()
        deferred.resolve true
        deferred.promise
      scope.onLeaveRestaurant()
      scope.$digest()
      Cart.reset.should.have.been.called
      Order.resetCurrentOrder.should.have.been.called
      $ionicHistory.goBack.should.have.been.called

    it 'should not call any of these if the Popup.confirm is resoved with a false value', ->
      sandbox.stub Cart, 'reset'
      sandbox.stub Order, 'resetCurrentOrder'
      sandbox.stub $ionicHistory, 'goBack'
      sandbox.stub Popup, 'confirm', ->
        deferred = $q.defer()
        deferred.resolve false
        deferred.promise
      scope.onLeaveRestaurant()
      scope.$digest()
      Cart.reset.should.not.have.been.called
      Order.resetCurrentOrder.should.not.have.been.called
      $ionicHistory.goBack.should.not.have.been.called
