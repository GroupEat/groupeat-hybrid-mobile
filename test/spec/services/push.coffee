'use strict'

describe 'Service: Push', ->

  beforeEach(module('groupeat'))

  scope = {}
  Push = {}

  beforeEach inject ($rootScope, _Push_) ->
    scope = $rootScope.$new()
    Push = _Push_
