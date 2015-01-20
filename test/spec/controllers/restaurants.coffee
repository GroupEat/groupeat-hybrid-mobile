describe 'Ctrl: RestaurantsCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = scope = $state = $httpBackend = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      ctrl = $controller('RestaurantsCtrl', ($scope: scope, $state: $state))
      $httpBackend = $injector.get('$httpBackend')
      mockData = [{key:"test"},{key:"test2"}]
      url = 'data/restaurants.json'
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

    it 'current state should be group-orders', ->
      $state.current.name.should.equal('group-orders')

    it 'should load a list of 2 restaurants', ->
      scope.restaurants.should.have.length(2)
