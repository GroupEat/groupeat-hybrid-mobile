describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat'
    module 'templates'

  ctrl = scope = $state = $httpBackend = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      ctrl = $controller('GroupOrdersCtrl', ($scope: scope, $state: $state, GroupOrder: $injector.get('GroupOrder')))
      $httpBackend = $injector.get('$httpBackend')
      mockData = [{key:"test"},{key:"test2"}]
      url = 'data/group-orders.json'
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')


  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

    it 'should load a list of 2 group-order', ->
      scope.groupOrders.should.have.length(2)
