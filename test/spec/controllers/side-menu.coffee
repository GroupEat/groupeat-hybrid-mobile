describe 'Ctrl: SideMenuCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.side-menu'
    module 'templates'

  ctrl = scope = $ionicSideMenuDelegate = $httpBackend = sandbox = {}

  beforeEach ->
    inject ($rootScope, $controller, $injector) ->
      sandbox = sinon.sandbox.create()
      scope = $rootScope.$new()
      $ionicSideMenuDelegate = $injector.get('$ionicSideMenuDelegate')
      ctrl = $controller('SideMenuCtrl', ($scope: scope, $ionicSideMenuDelegate: $ionicSideMenuDelegate))

      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')

  it 'should load a list of 3 items', ->
    scope.menuItems.should.have.length(3)

  it 'should include the admissible keys for each tab', ->
    expect(menuItem).to.include.keys('title', 'iconClasses', 'stateTarget') for menuItem in scope.menuItems

  describe 'Methods', ->
    
    it 'should toggle left when clicking on menu button', ->
      callback = sandbox.stub($ionicSideMenuDelegate, 'toggleLeft')
      scope.toggleLeft()
      scope.$digest()
      callback.should.have.been.called
    
