describe 'Service: Order', ->
	
  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.order'
    module 'templates'

  Order = scope = $httpBackend = ENV = sandbox = BackendUtils = {}

  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Order = $injector.get('Order')
      ENV = $injector.get('ENV')
      _ = $injector.get('_')
      BackendUtils = $injector.get('BackendUtils')
      sandbox = sinon.sandbox.create()
      
  describe "Order Service contents :", ->

    it "should create a currentOrder", ->
      scope.$apply()

    it '#getRequestBody : should return request body', ->
      testObject = Order.getRequestBody()
      expect(testObject).not.to.equal(null)
      testObject.should.have.property('groupOrderId')
      testObject.should.have.property('foodRushDurationInMinutes')
      testObject.should.have.property('productFormats')
      testObject.should.have.property('street')
      testObject.should.have.property('details')
      testObject.should.have.property('latitude')
      testObject.should.have.property('longitude')
      testObject.should.have.property('comment')
      expect(Order).not.to.equal(null)

  describe "Order Service methods :", ->

    afterEach () ->

    it '#isNewOrder : should return true if new order, else false', ->
      response = Order.isNewOrder()
      expect(response).to.be.true

      Order.setCurrentOrder('8', null, 15)
      response = Order.isNewOrder()
      expect(response).to.be.false

    it '#setters of RequestBody : should set a property with an input value', ->
      Order.setGroupOrderId('123')
      Order.setFoodRushTime(40)
      Order.setProductFormats({'key': 'value'})
      Order.setStreet('5 rue michelet')
      Order.setDetails('2eme etage cote cour')
      Order.setLatitude(48)
      Order.setLongitude(2)
      Order.setComment('pas inintéressant')

      testRequestBody = Order.getRequestBody()

      expect(testRequestBody.groupOrderId).to.equal('123')
      expect(testRequestBody.foodRushDurationInMinutes).to.equal(40)
      expect(testRequestBody.productFormats.key).to.equal('value')
      expect(testRequestBody.street).to.equal('5 rue michelet')
      expect(testRequestBody.details).to.equal('2eme etage cote cour')
      expect(testRequestBody.latitude).to.equal(48)
      expect(testRequestBody.longitude).to.equal(2)
      expect(testRequestBody.comment).to.equal('pas inintéressant')

    it '#currentOrder : should set currentOrder', ->
      Order.setCurrentOrder('123', '2015-01-30 16:39:26', 17)

      expect(Order.getCurrentOrder().groupOrderId).to.equal('123')
      expect(Order.getCurrentOrder().endingAt).to.equal('2015-01-30 16:39:26')
      expect(Order.getCurrentOrder().currentDiscount).to.equal(17)

    it '#currentOrder : should get currentOrder', ->
      testCurrentOrder = Order.getCurrentOrder()
      testCurrentOrder.should.have.property('groupOrderId')
      testCurrentOrder.should.have.property('endingAt')
      testCurrentOrder.should.have.property('currentDiscount')

    it '#currentOrder : should reset currentOrder', ->
      Order.setCurrentOrder('123', '2015-01-30 16:39:26', 17)
      Order.resetCurrentOrder()

      expect(Order.getCurrentOrder().groupOrderId).to.equal(null)
      expect(Order.getCurrentOrder().endingAt).to.equal(null)
      expect(Order.getCurrentOrder().currentDiscount).to.equal(null)

    it '#getTimeDiff : should return difference between current date and input', ->
      # Help wanted : this test has to be improved....
      dateMock = '2015-01-30 16:39:26'
      response = Order.getTimeDiff(dateMock)
      expect(response > 3000000).to.be.true

    it '#getTimeDiff : should return null if input is not a date', ->
      expect(Order.getTimeDiff(null)).to.equal.null

  describe 'Method save :', ->

    it 'should have a save method', ->
      Order.should.have.property('save')

    it 'should return a fulfilled promise when the server responds normally', ->
      requestBody = {}
      response = {id: 1, token: 'token'}
      $httpBackend.whenPOST(ENV.apiEndpoint+'/orders').respond(response)
      order = Order.save(requestBody)
      order.should.eventually.have.property('id').and.equal(1)
      order.should.eventually.have.property('token').and.equal('token')
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      errorMsgFromBackend = 'errorMsgFromBackend'
      sandbox.stub(BackendUtils, 'errorMsgFromBackend').returns(errorMsgFromBackend)
      requestBody = {}
      $httpBackend.whenPOST(ENV.apiEndpoint+'/orders').respond(400, 'Failure')
      Order.save(requestBody).should.be.rejectedWith(errorMsgFromBackend)
      $httpBackend.flush()



