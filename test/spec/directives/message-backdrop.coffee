describe 'Directive: geMessageBackdrop', ->

  beforeEach ->
    module 'groupeat.directives.message-backdrop'
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

  it 'should inject a div with the white-backdrop class', ->
    element = $compile("<ge-message-backdrop></ge-message-backdrop>")($rootScope)
    $rootScope.$digest()
    element.html().should.contain('<div class="white-backdrop visible active">')

  it 'the injected html should contain all text elements in scope.messageBackdrop', ->
    element = $compile("<ge-message-backdrop></ge-message-backdrop>")($rootScope)
    title = 'title'
    details = 'details'
    buttonText = 'buttonText'
    $rootScope.messageBackdrop =
      title: title
      details: details
      button:
        text: buttonText
    $rootScope.$digest()
    element.find('h1').html().should.contain(title)
    element.find('p').html().should.contain(details)
    element.find('button').html().should.contain(buttonText)

  it 'the icon in the message backdrop should have classes mentioned in scope.messageBackdrop', ->
    element = $compile("<ge-message-backdrop></ge-message-backdrop>")($rootScope)
    iconClasses = 'iconClasses'
    $rootScope.messageBackdrop =
      iconClasses: iconClasses
    $rootScope.$digest()
    element.find('i').hasClass(iconClasses).should.be.true

  it 'the scope should have a call method', ->
    element = $compile("<ge-message-backdrop></ge-message-backdrop>")($rootScope)
    $rootScope.$digest()
    element.scope().should.have.property('call')

  it 'the scope call method should call the method provided as argument', ->
    element = $compile("<ge-message-backdrop></ge-message-backdrop>")($rootScope)
    $rootScope.$digest()
    scope = element.scope()
    sandbox.spy(scope, '$apply')
    methodName = 'methodName'
    scope.call(methodName)
    $timeout.flush()
    scope.$apply.should.have.been.calledWithExactly(methodName)
