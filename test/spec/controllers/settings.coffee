describe 'Ctrl: SettingsCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.settings'

  ctrl = scope = {}

  beforeEach ->
    inject ($controller, $rootScope) ->
      scope = $rootScope.$new()
      ctrl = $controller('SettingsCtrl', ($scope:scope))
