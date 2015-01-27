describe 'Directive: geHideTabs', ->

  beforeEach ->
    module 'groupeat'
    module 'templates'

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
      httpBackend.whenGET(/^translations\/.*/).respond('{}')

  describe 'Constructor', ->

    beforeEach ->
      httpBackend.flush()

    it 'should hide tabs', ->
      scope.$digest()
      expect(rootScope.hideTabs).to.be.true

    it 'should show tabs', ->
      scope.$digest()
      rootScope.$broadcast('$destroy')
      expect(rootScope.hideTabs).to.be.false
