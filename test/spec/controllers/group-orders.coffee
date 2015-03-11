describe 'Ctrl: GroupOrdersCtrl', ->

  beforeEach ->
    module 'groupeat.controllers.group-orders'
    module 'templates'

  ctrl = scope = $state = $httpBackend = {}

  beforeEach ->
    inject ($controller, $rootScope, $injector) ->
      scope = $rootScope.$new()
      ctrl = $controller('GroupOrdersCtrl', ($scope: scope, $state: $state, GroupOrder: $injector.get('GroupOrder'), MessageBackdrop: $injector.get('MessageBackdrop'), Order: $injector.get('Order'), Popup: $injector.get('Popup'), $geolocation: $injector.get('$geolocation'), _: $injector.get('_')))
      $httpBackend = $injector.get('$httpBackend')
      ENV = $injector.get('ENV')
      mockData = {data:[{key:"test"},{key:"test2"}] }
      url = ENV.apiEndpoint+'/groupOrders?joinable=1&include=restaurant'
      $httpBackend.whenGET(url).respond(mockData)
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
