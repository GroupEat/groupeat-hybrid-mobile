describe 'Ctrl: CartCtrl', ->

  beforeEach ->
    module 'groupeat'
    module 'templates'

  ctrl = scope = $state = $httpBackend = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      ctrl = $controller('CartCtrl', ($scope: scope, $state: $state, _: $injector.get('_'), Cart: $injector.get('Cart')))
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

    it 'cart should have been created', ->
      scope.cart.should.have.property('cartTotalPrice')
      scope.cart.should.have.property('cartTotalQuantity')
      scope.cart.should.have.property('productsItems')

    it 'cart should be empty if no productsItems have been added', ->
      if _.isEmpty(scope.cart.productsItems)
        expect(scope.isCartEmpty).to.be.true
      else
        expect(scope.isCartEmpty).to.be.false
