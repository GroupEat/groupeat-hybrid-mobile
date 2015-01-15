describe 'Ctrl: CartCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = httpBackend = scope = state = {}

  beforeEach ->
    inject ($controller, $rootScope, $state, $httpBackend, Cart, _) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      state = $state
      ctrl = $controller('CartCtrl', ($scope:scope, $state:state, _:_, Cart: Cart))
      httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      httpBackend.flush()

    it 'cart should have been created', ->
      scope.cart.should.have.property('cartTotalPrice')
      scope.cart.should.have.property('cartTotalQuantity')
      scope.cart.should.have.property('productsItems')

    it 'cart should be empty if no productsItems have been added', ->
      if _.isEmpty(scope.cart.productsItems)
        expect(scope.isCartEmpty).to.be.true
      else
        expect(scope.isCartEmpty).to.be.false
