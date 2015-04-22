describe 'Service: CustomerSettings', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.customer-settings'
    module 'templates'

  CustomerSettings = scope = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      CustomerSettings = $injector.get('CustomerSettings')

  describe 'CustomerSettings#getNoNotificationAfterHours', ->

    it 'should exist', ->
      CustomerSettings.should.have.property('getNoNotificationAfterHours')

    it 'should return a non empty array', ->
      noNotificationAfterHours = CustomerSettings.getNoNotificationAfterHours()
      noNotificationAfterHours.should.be.instanceof(Array)
      noNotificationAfterHours.should.be.not.empty

  describe 'CustomerSettings#getDaysWithoutNotifying', ->

    it 'should exist', ->
      CustomerSettings.should.have.property('getDaysWithoutNotifying')

    it 'should return a non empty array', ->
      daysWithoutNotifying = CustomerSettings.getDaysWithoutNotifying()
      daysWithoutNotifying.should.be.instanceof(Array)
      daysWithoutNotifying.should.be.not.empty

    it 'should return a sorted array', ->
      daysWithoutNotifying = CustomerSettings.getDaysWithoutNotifying()
      sortedDaysWithoutNotifying = daysWithoutNotifying.sort()
      daysWithoutNotifying.should.equal(sortedDaysWithoutNotifying)
