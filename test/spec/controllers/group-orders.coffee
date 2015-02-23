describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  ctrl = scope = $state = $httpBackend = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      ctrl = $controller('GroupOrdersCtrl', ($scope: scope, $state: $state, GroupOrder: $injector.get('GroupOrder')))
      $httpBackend = $injector.get('$httpBackend')
      ENV = $injector.get('ENV')
      mockData = {data:[{key:"test"},{key:"test2"}] }
      url = ENV.apiEndpoint+'/groupOrders?joinable=1&include=restaurant'
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')


  describe 'Constructor', ->

    beforeEach ->
      $httpBackend.flush()

    it 'should load a list of 2 group-order', ->
      scope.groupOrders.data.should.have.length(2)
