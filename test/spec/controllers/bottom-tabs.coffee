describe 'Ctrl: BottomTabsCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = scope = $state = _ = {}

  beforeEach ->
    inject ($rootScope, $controller, $injector) ->
      scope = $rootScope.$new()
      $state = $injector.get('$state')
      ctrl = $controller('BottomTabsCtrl', ($scope: scope, $state: $state))
      _ = $injector.get('_')

  it 'should load a list of 2 tabs', ->
    scope.bottomTabs.should.have.length(2)

  it 'should include the admissible keys for each tab', ->
    expect(tab).to.include.keys('title', 'iconClasses', 'stateTarget') for tab in scope.bottomTabs


  it 'should include one of the valid states as stateTarget', ->
    validStateNames = _.pluck($state.get(), 'name')
    expect(validStateNames).to.contain(tab.stateTarget) for tab in scope.bottomTabs
