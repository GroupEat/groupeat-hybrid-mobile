describe 'Ctrl: RestaurantMenuCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = httpBackend = scope = state = q = sandbox = Cart = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      httpBackend = $injector.get('$httpBackend')
      state = $injector.get('$state')
      Cart = $injector.get('Cart')
      ctrl = $controller('RestaurantMenuCtrl', ($scope: scope, $state: state, Pizza: $injector.get('Pizza'), Cart: $injector.get('Cart')))
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
      product =
        'name': 'test'
        'id': 1
        'description': 'for test'
        'formats':
          'id': 10
          'size': 'Junior'
          'price': 8
          ,
          'id': 11
          'size': 'test'
          'price': 10
          ,
          'id': 12
          'size': 'test1'
          'price': 12

      callback = sandbox.stub(Cart, 'addProductToCart')

      scope.onProductAdd(product, product.formats[0])
      assert(callback.calledOnce)
      assert(callback.calledWithExactly(product, product.formats[0]))

    it 'should toggle product if asking', ->
      product =
        'name': 'test'
        'id': 1
        'description': 'for test'

      scope.toggleDetails(product)
      scope.$apply()
      expect(scope.shownDetails).to.equal(product)

    it 'should not toggle product if not asking', ->
      product = 10

      scope.shownDetails = product
      scope.toggleDetails(product)
      scope.$apply()
      expect(scope.shownDetails).to.equal(null)

    it 'should right product be shown', ->
      product =
        'name': 'test'
        'id': 1
        'description': 'for test'
        'formats':
          'id': 10
          'size': 'Junior'
          'price': 8
          ,
          'id': 11
          'size': 'test'
          'price': 10
          ,
          'id': 12
          'size': 'test1'
          'price': 12

      scope.shownDetails = product
      expect(scope.isDetailsShown(product)).to.be.true
      scope.shownDetails = null
      expect(scope.isDetailsShown(product)).to.be.false
