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
      $httpBackend.expectGET('https://groupeat.fr/api/restaurants').respond('problem having products from restaurants BE')
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

