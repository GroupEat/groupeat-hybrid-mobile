describe 'Directive: geMessageBackdrop', ->

  beforeEach ->
    module 'groupeat.directives.message-backdrop'
    module 'templates'

  element = $compile = $scope = isolateScope = sandbox = {}

  beforeEach ->
    inject ($compile, $rootScope, $injector) ->
      sandbox = sinon.sandbox.create()
      $scope = $rootScope.$new()
      $injector.get('$httpBackend').whenGET(/^translations\/.*/).respond('{}')
      element = $compile('<ge-message-backdrop></ge-message-backdrop>')($scope)
      $scope.$digest()

  afterEach ->
    sandbox.restore()

  beforeEach ->
    isolateScope = element.isolateScope()

  it 'the scope should have a isDisplayed method', ->
    isolateScope.should.have.property 'isDisplayed'

  it 'the scope should have a isLoading method', ->
    isolateScope.should.have.property 'isLoading'

  it 'the scope should have a buttonAction method', ->
    isolateScope.should.have.property 'buttonAction'
