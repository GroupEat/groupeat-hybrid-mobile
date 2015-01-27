describe 'Directive: geTouch', ->

  beforeEach ->
    module 'groupeat'
    module 'templates'

  scope = httpBackend = element = sandbox = {}

  beforeEach ->
    inject ($compile, $rootScope, $httpBackend) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      sandbox = sinon.sandbox.create()
      element = angular.element('<button ge-touch="callbackFunction"></button>')
      $compile(element)(scope)
      httpBackend.whenGET(/^translations\/.*/).respond('{}')

  afterEach ->
    sandbox.restore()


  it 'should react to touchstart event', ->
    sandbox.spy(scope, '$apply')
    element.triggerHandler('touchstart')
    scope.$apply.should.have.been.calledWithExactly('callbackFunction')


  it 'should react to click event', ->
    sandbox.spy(scope, '$apply')
    element.triggerHandler('click')
    scope.$apply.should.have.been.calledWithExactly('callbackFunction')
