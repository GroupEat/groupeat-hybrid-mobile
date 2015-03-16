describe 'Directive: geHideTabs', ->

  beforeEach ->
    module 'groupeat.directives.hide-tabs'
    module 'templates'

  rootScope = scope = elm = {}

  beforeEach ->
    inject ($compile, $rootScope, $httpBackend) ->
      scope = $rootScope.$new()
      element = angular.element(
        '<ion-view ge-hide-tabs>' +
        '</ion-view>'
      )
      $compile(element)(scope)
      rootScope = $rootScope

  describe 'Constructor', ->

    it 'should hide tabs', ->
      scope.$digest()
      expect(rootScope.hideTabs).to.be.true

    it 'should show tabs', ->
      scope.$digest()
      rootScope.$broadcast('$destroy')
      expect(rootScope.hideTabs).to.be.false
