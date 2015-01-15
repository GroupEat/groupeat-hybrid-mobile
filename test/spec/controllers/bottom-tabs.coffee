describe 'Ctrl: BottomTabsCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = httpBackend = scope = state = {}

  beforeEach ->
    inject ($controller, $rootScope, $state, $httpBackend) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      state = $state
      ctrl = $controller('BottomTabsCtrl', ($scope:scope, $state:state))

  it 'should load a list of 2 tabs', ->
    scope.bottomTabs.should.have.length(2)
