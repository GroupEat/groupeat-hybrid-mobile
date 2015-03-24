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
