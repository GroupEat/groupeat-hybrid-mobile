describe 'Directive: geRestaurantCard', ->

  beforeEach ->
    module 'groupeat.directives.restaurant-card'
    module 'templates'

  $state = element = isolated = sandbox = scope = {}

  beforeEach ->
    inject ($compile, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      scope.data = {}

      element = $compile('<ge-restaurant-card data="data"></ge-restaurant-card>') scope

      scope.$digest()

  afterEach ->
    sandbox.restore()

  describe 'geRestaurantCard#setArrayFromInt', ->

    beforeEach ->
      isolated = element.isolateScope()

    it 'the scope should have a setArrayFromInt method', ->
      isolated.should.have.property('setArrayFromInt')
