describe 'Directive: geLoadingBackdrop', ->

  beforeEach ->
    module 'groupeat.directives.loading-backdrop'
    module 'templates'

  $compile = $rootScope = sandbox = $timeout = {}

  beforeEach ->
    inject (_$compile_, _$rootScope_, $injector) ->
      sandbox = sinon.sandbox.create()
      $compile = _$compile_
      $rootScope = _$rootScope_
      $timeout = $injector.get('$timeout')

  afterEach ->
    sandbox.restore()

  it 'should inject a md-progress-circular html tag', ->
    element = $compile("<ge-loading-backdrop></ge-loading-backdrop>")($rootScope)
    $rootScope.$digest()
    element.html().should.contain('<md-progress-circular')

  it 'the icon in the message backdrop should have classes mentioned in scope.messageBackdrop', ->
    element = $compile("<ge-loading-backdrop></ge-loading-backdrop>")($rootScope)
    loadingBackdropClass = 'class'
    $rootScope.loadingBackdrop =
      class: loadingBackdropClass
    $rootScope.$digest()
    element.find('div').hasClass(loadingBackdropClass).should.be.true

  it 'the scope should have a call method', ->
    element = $compile("<ge-loading-backdrop></ge-loading-backdrop>")($rootScope)
    circular = 'circular'
    $rootScope.loadingBackdrop =
      circular: circular
    $rootScope.$digest()
    element.find('md-progress-circular').attr('id').should.equal(circular)
