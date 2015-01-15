describe 'Ctrl: SettingsCtrl', ->

  beforeEach ->
    module 'groupeat'

  ctrl = scope = {}

  beforeEach ->
    inject ($controller, $rootScope) ->
      scope = $rootScope.$new()
      ctrl = $controller('SettingsCtrl', ($scope:scope))

  describe 'Constructor', ->

    it 'should create a list of 2 settings', ->
      scope.settingsList.should.have.length(2)

    it 'should have a name and state fields', ->
      for setting in scope.settingsList
        do (setting) ->
          setting.should.have.property('name')
          setting.should.have.property('state')
