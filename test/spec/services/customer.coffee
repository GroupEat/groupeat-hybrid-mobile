describe 'Service: Customer', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat'
    module 'templates'

  Customer = scope = $httpBackend = ENV = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Customer = $injector.get('Customer')
      ENV = $injector.get('ENV')

  it 'get method is expected to fetch the proper response', ->
    $httpBackend.expectGET(ENV.apiEndpoint+'/customers').respond({
      id:7,
      token: 'jklhkjhlkhl'
    })
    result = Customer.get()
    $httpBackend.flush()
    expect(result.id).to.equal(7)
    expect(result.token).to.equal('jklhkjhlkhl')
