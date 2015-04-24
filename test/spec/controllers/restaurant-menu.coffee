describe 'Ctrl: RestaurantMenuCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.restaurant-menu'
    module 'templates'

  ctrl = $httpBackend = scope = $state = $q = sandbox = Cart = Popup = {}

  cartTest =
    cartTotalPrice: 88
    cartTotalQuantity: 4
    productsItems: [{
      id: 1
      name: 'test'
      totalQuantity: 4
      totalPrice: 89
      formats: [{
        id: 10
        size: 'Junior'
        price: 8
        quantity: 1
        },{
        id: 11
        size: 'test'
        price: 8
        quantity: 3
        }
      ]
      },{
      id: 83
      name: 'test'
      totalQuantity: 0
      totalPrice: 0
      formats: [{
        id: 120
        size: 'other'
        price: 8
        quantity: 1
        },{
        id: 121
        size: 'test 8'
        price: 8
        quantity: 2
      }]
    }]

  productTest =
    name: 'test'
    id: 1
    description: 'for test'
    formats: [{
      id: 10
      size: 'Junior'
      price: 8
      },{
      id: 11
      size: 'test'
      price: 10
      },{
      id: 12
      size: 'test1'
      price: 12
    }]


  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      Cart = $injector.get('Cart')
      Popup = $injector.get('Popup')
      sandbox = sinon.sandbox.create()
      $httpBackend = $injector.get('$httpBackend')
      ctrl = $controller('RestaurantMenuCtrl', ($scope: scope, $state: $state, $stateParams: $injector.get('$stateParams'), $filter: $injector.get('$filter'), $mdDialog: $injector.get('$mdDialog'), MessageBackdrop: $injector.get('MessageBackdrop'), Network: $injector.get('Network'), Product: $injector.get('Product'), Cart: Cart, Popup: Popup, $ionicNavBarDelegate: $injector.get('$ionicNavBarDelegate'),
      Order: $injector.get('Order'), $ionicHistory: $injector.get('$ionicHistory'), _: $injector.get('_')))

      ENV = $injector.get('ENV')
      mockData = [{key:"test"},{key:"test2"}]
      url = 'data/pizzas/pizzas_restaurant_.json'
      $httpBackend.expectGET(ENV.apiEndpoint+'/restaurants/products?include=formats').respond(401)
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      sandbox = sinon.sandbox.create()

  afterEach ->
    sandbox.restore()

  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

    it 'should create an empty cart', ->
      expect(scope.cart).not.to.equal(null)
      scope.cart.should.have.property('getTotalPrice')
      scope.cart.should.have.property('getTotalQuantity')
      scope.cart.should.have.property('getProducts')
      expect(_.isEmpty(scope.cart.getProducts())).to.be.true


  describe 'State change', ->

    beforeEach ->
      $httpBackend.flush()

    it 'should call Cart service function add product if totalQuantity is not equal to remaingCapacity ', ->
      callback = sandbox.stub(Cart, 'addProduct')
      scope.onAddProduct(productTest, productTest.formats[0])
      assert(callback.calledOnce)
      assert(callback.calledWithExactly(productTest, productTest.formats[0]))

    it 'should not call Cart service function add product if totalQuantity is equal to remaingCapacity ', ->
      callback = sandbox.stub(Cart, 'addProduct')
      scope.currentOrder.remainingCapacity = scope.cart.getTotalQuantity()
      scope.onAddProduct(productTest, productTest.formats[0])
      callback.should.not.have.been.called

    it 'should called Popup service if totalQuantity is equal to remaingCapacity ', ->
      callback = sandbox.stub(Popup, 'displayError')
      scope.currentOrder.remainingCapacity = scope.cart.getTotalQuantity()
      scope.onAddProduct(productTest, productTest.formats[0])
      assert(callback.calledOnce)

    it 'should call Cart service function remove product', ->
      callback = sandbox.stub(Cart, 'removeProduct')
      scope.onDeleteProduct(productTest, 10)
      assert(callback.calledOnce)
      assert(callback.calledWithExactly(productTest, 10))

    it 'should toggle product if asking', ->
      scope.toggleDetails(productTest)
      scope.$apply()
      expect(scope.detailedProduct).to.equal(productTest)

    it 'should not toggle product if not asking', ->
      scope.detailedProduct = productTest
      scope.toggleDetails(productTest)
      scope.$apply()
      expect(scope.detailedProduct).to.equal(null)

    it 'should right product be shown', ->
      scope.detailedProduct = productTest
      expect(scope.areDetailsShown(productTest)).to.be.true
      scope.detailedProduct = null
      expect(scope.areDetailsShown(productTest)).to.be.false

    it 'should leave restaurant menu cell without poping if cart is empty', ->
      scope.onLeaveRestaurant()
      expect($state.current.name).to.not.equal('restaurant-menu')

    it 'should alert user when leaving restaurant menu cell if cart is not empty', ->

    it 'should reset cart if user confirms leaving restaurant menu cell if cart is not empty', ->

    it 'should not reset cart if user cancels its will to leave restaurant menu if cart is not empty', ->
