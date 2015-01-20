describe 'Ctrl: RestaurantMenuCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = httpBackend = scope = state = q = sandbox = Cart = ionicPopup = {}
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
      httpBackend = $injector.get('$httpBackend')
      state = $injector.get('$state')
      Cart = $injector.get('Cart')
      ionicPopup = $injector.get('$ionicPopup')
      ctrl = $controller('RestaurantMenuCtrl', ($scope: scope, $state: state, Pizza: $injector.get('Pizza'), Cart: $injector.get('Cart'), ionicPopup : $injector.get('$ionicPopup')))
      sandbox = sinon.sandbox.create()
      mockData = [{key:"test"},{key:"test2"}]
      url = 'data/pizzas/pizzas_restaurant_.json'
      httpBackend.whenGET(url).respond(mockData)
      httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()


  describe 'Constructor', ->

    beforeEach ->
      httpBackend.flush()

    it 'should load a list of 2 pizzas', ->
      scope.pizzas.should.have.length(2)

    it 'should create an empty cart', ->
      expect(scope.cart).not.to.equal(null)
      scope.cart.should.have.property('cartTotalPrice')
      scope.cart.should.have.property('cartTotalQuantity')
      scope.cart.should.have.property('productsItems')
      expect(_.isEmpty(scope.cart.productsItems)).to.be.true


  describe 'State change', ->

    beforeEach ->
      httpBackend.flush()

    it 'should call Cart service function add product', ->
      callback = sandbox.stub(Cart, 'addProductToCart')
      scope.onProductAdd(productTest, productTest.formats[0])
      assert(callback.calledOnce)
      assert(callback.calledWithExactly(productTest, productTest.formats[0]))

    it 'should call Cart service function remove product', ->
      callback = sandbox.stub(Cart, 'removeProductFromCart')
      scope.onProductDelete(productTest, 10)
      assert(callback.calledOnce)
      assert(callback.calledWithExactly(productTest, 10))

    it 'should toggle product if asking', ->
      scope.toggleDetails(productTest)
      scope.$apply()
      expect(scope.shownDetails).to.equal(productTest)

    it 'should not toggle product if not asking', ->
      scope.shownDetails = productTest
      scope.toggleDetails(productTest)
      scope.$apply()
      expect(scope.shownDetails).to.equal(null)

    it 'should right product be shown', ->
      scope.shownDetails = productTest
      expect(scope.isDetailsShown(productTest)).to.be.true
      scope.shownDetails = null
      expect(scope.isDetailsShown(productTest)).to.be.false

    it 'should right product\'s quantity be shown when cart is empty', ->
      scope.changeProductToShowValue(productTest,11)
      expect(scope.productToShowValue).to.equal(0)

    it 'should right product\'s quantity be shown when cart is not empty', ->
      scope.cart = cartTest
      scope.changeProductToShowValue(productTest,11)
      expect(scope.productToShowValue).to.equal(3)

    it 'should leave restaurant menu cell without poping if cart is empty', ->
      scope.onLeaveRestaurantTouch()
      expect(state.current.name).to.not.equal('restaurant-menu')

    it 'should alert user when leaving restaurant menu cell if cart is not empty', ->

    it 'should reset cart if user confirms leaving restaurant menu cell if cart is not empty', ->
    
    it 'should not reset cart if user cancels its will to leave restaurant menu if cart is not empty', ->