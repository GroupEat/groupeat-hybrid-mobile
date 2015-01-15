describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = httpBackend = scope = state = {}

  beforeEach ->
    inject ($controller, $rootScope, $state, $httpBackend, GroupOrder) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      state = $state
      ctrl = $controller('GroupOrdersCtrl', ($scope:scope, $state:state, GroupOrder: GroupOrder))
      mockData = [{key:"test"},{key:"test2"}]
      url = 'data/group-orders.json'
      httpBackend.whenGET(url).respond(mockData)
      httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      httpBackend.whenGET(/^translations\/.*/).respond('{}')


  describe 'Constructor', ->

    beforeEach ->
      httpBackend.flush()

    it 'current state should be group-orders', ->
      state.current.name.should.equal('group-orders')

    it 'should load a list of 2 group-order', ->
      scope.groupOrders.should.have.length(2)
