describe 'Service: Notifications-Settings', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.notifications-settings'
    module 'templates'

  NotificationsSettings = scope = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      NotificationsSettings = $injector.get('NotificationsSettings')

  describe 'NotificationsSettings#getNoNotificationAfterHours', ->

    it 'should exist', ->
      NotificationsSettings.should.have.property('getNoNotificationAfterHours')

    it 'should return a non empty array', ->
      noNotificationAfterHours = NotificationsSettings.getNoNotificationAfterHours()
      noNotificationAfterHours.should.be.instanceof(Array)
      noNotificationAfterHours.should.be.not.empty

  describe 'NotificationsSettings#getDaysWithoutNotifying', ->

    it 'should exist', ->
      NotificationsSettings.should.have.property('getDaysWithoutNotifying')

    it 'should return a non empty array', ->
      daysWithoutNotifying = NotificationsSettings.getDaysWithoutNotifying()
      daysWithoutNotifying.should.be.instanceof(Array)
      daysWithoutNotifying.should.be.not.empty

    it 'should return a sorted array', ->
      daysWithoutNotifying = NotificationsSettings.getDaysWithoutNotifying()
      sortedDaysWithoutNotifying = daysWithoutNotifying.sort()
      daysWithoutNotifying.should.equal(sortedDaysWithoutNotifying)
