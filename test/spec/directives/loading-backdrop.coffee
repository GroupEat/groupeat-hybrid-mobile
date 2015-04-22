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

   it 'should inject a div with the loading-backdrop class', ->
    element = $compile("<ge-loading-backdrop></ge-loading-backdrop>")($rootScope)
    $rootScope.$digest()
    element.html().should.contain('<div class="loading-backdrop visible active">')

  it 'should inject a md-progress-circular html tag', ->
    element = $compile("<ge-loading-backdrop></ge-loading-backdrop>")($rootScope)
    $rootScope.$digest()
    element.html().should.contain('</md-progress-circular>')

