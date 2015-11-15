describe 'Service: CustomerSettings', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.customer-settings'
    module 'templates'

  CustomerSettings = scope = apiEndpoint = $httpBackend = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      CustomerSettings = $injector.get('CustomerSettings')
      apiEndpoint = $injector.get('apiEndpoint')
      $httpBackend = $injector.get('$httpBackend')

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

  describe 'CustomerSettings#get', ->

    it 'should have an get method', ->
      CustomerSettings.should.have.property('get')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/settings$')
      customerSettings = []
      response =
        data:
          customerSettings
      $httpBackend.expect('GET', regex).respond(response)
      CustomerSettings.get(1).should.become(customerSettings)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/settings$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      CustomerSettings.get(1).should.be.rejected
      $httpBackend.flush()

  describe 'CustomerSettings#update', ->

    it 'should have an get method', ->
      CustomerSettings.should.have.property('update')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/settings$')
      customerSettings = []
      response =
        data:
          customerSettings
      $httpBackend.expect('PUT', regex).respond(response)
      CustomerSettings.update(1, null).should.become(customerSettings)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+apiEndpoint+'/customers/\\d+/settings$')
      $httpBackend.expect('PUT', regex).respond(400, 'Failure')
      CustomerSettings.update(1, null).should.be.rejected
      $httpBackend.flush()
