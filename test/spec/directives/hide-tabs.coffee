describe 'Directive: geHideTabs', ->

  beforeEach ->
    module 'groupeat'

  rootScope = scope = httpBackend = elm = {}

  beforeEach ->
    inject ($compile, $rootScope, $httpBackend) ->
      scope = $rootScope.$new()
      httpBackend = $httpBackend
      element = angular.element(
        '<ion-view ge-hide-tabs>' +
        '</ion-view>'
      )
      $compile(element)(scope)
      rootScope = $rootScope
      httpBackend.whenGET(/^templates\/.*/).respond('<html></html>')
      httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      httpBackend.flush()

    it 'should hide tabs', ->
      scope.$digest()
      expect(rootScope.hideTabs).to.be.true

    it 'should  to true', ->
      scope.$digest()
      rootScope.$broadcast('$destroy')
      expect(rootScope.hideTabs).to.be.false
