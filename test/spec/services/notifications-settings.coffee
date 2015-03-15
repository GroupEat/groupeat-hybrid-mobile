describe 'Service: Notifications-Settings', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.notifications-settings'
    module 'templates'

  NotificationSettings = scope = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      NotificationSettings = $injector.get('NotificationsSettings')

  describe 'User settings', ->
    it 'should not be empty', ->
      expect(NotificationSettings.settings).not.to.equal(null)
    it 'should have a Push activation property', ->
      NotificationSettings.settings.should.have.property('pushActivation')
    it 'should have a Dont Push After property', ->
      NotificationSettings.settings.should.have.property('dontPushAfter')
    it 'should have a dont Push For property', ->
      NotificationSettings.settings.should.have.property('dontPushFor')

  describe 'User settings values', ->
    it 'should not be empty', ->
      expect(NotificationSettings.settingslabel).not.to.equal(null)
    it 'should have a Push activation property', ->
      NotificationSettings.settingsLabel.should.have.property('pushActivation')
    it 'should have a Dont Push After property', ->
      NotificationSettings.settingsLabel.should.have.property('dontPushAfter')
    it 'should have a dont Push For property', ->
      NotificationSettings.settingsLabel.should.have.property('dontPushFor')


  describe 'Pivot Table settings', ->
    it 'should have a Dont Push After property', ->
      NotificationSettings.pivotTableSettings.should.have.property('dontPushAfter')
    it 'should have a dont Push For property', ->
      NotificationSettings.pivotTableSettings.should.have.property('dontPushFor')

  # describe 'Save settings function', ->
  #   it 'should modify the settings and send it to the backend'
