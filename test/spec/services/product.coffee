describe 'Service: Product', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.product'
    module 'templates'

  Product = scope = $httpBackend = ENV = sandbox = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Product = $injector.get('Product')
      ENV = $injector.get('ENV')
      sandbox = sinon.sandbox.create()

  describe 'Product#get', ->

    it 'should have an get method', ->
      Product.should.have.property('get')

    it 'should return a fulfilled promise when the request returns a 200 status', ->
      products = []
      response =
        data:
          products
      regex = new RegExp('^'+ENV.apiEndpoint+'/restaurants/\\d+/products\\?include=formats$')
      $httpBackend.expect('GET', regex).respond(response)
      Product.get(1).should.become(products)
      $httpBackend.flush()

    it 'should return a fulfilled promise with the prices divided by 100 when the response from the server is appropriate', ->
      response = {
        data:
          [
            formats: {
              data:
                [
                  {
                    price:1000
                  },
                  {
                    price:90
                  }
                ]
            }
          ]
      }
      expected = [
        formats: {
          data:
            [
              {
                price:10
              },
              {
                price:0.9
              }
            ]
        }
      ]

      regex = new RegExp('^'+ENV.apiEndpoint+'/restaurants/\\d+/products\\?include=formats$')
      $httpBackend.expect('GET', regex).respond(response)
      Product.get(1).should.become(expected)
      $httpBackend.flush()

    it 'should reject a promise with an error message when the server responds with an error', ->
      regex = new RegExp('^'+ENV.apiEndpoint+'/restaurants/\\d+/products\\?include=formats$')
      $httpBackend.expect('GET', regex).respond(400, 'Failure')
      Product.get(1).should.be.rejected
      $httpBackend.flush()
