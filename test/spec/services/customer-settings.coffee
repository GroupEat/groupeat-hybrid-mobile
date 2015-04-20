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
      
  describe 'CustomerSettings#get', ->

    it 'should have an get method', ->
      GroupOrder.should.have.property('get')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/groupOrders\\?joinable=1&around=1&latitude=\\d+&longitude=1&include=restaurant$')
      orders = []
      response =
        data:
          orders
      $httpBackend.expect('GET', regex).respond(response)
      GroupOrder.get(1, 1).should.become(orders)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/groupOrders\\?joinable=1&around=1&latitude=\\d+&longitude=\\d+&include=restaurant$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      GroupOrder.get(1, 1).should.be.rejected
      $httpBackend.flush()
