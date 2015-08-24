describe 'Filter: timeLabel', ->

  beforeEach ->
    module 'groupeat.filters.time-label'
    module 'groupeat.services.customer-settings'

  $filter = {}

  beforeEach ->
    inject (_$filter_) ->
      $filter = _$filter_

  describe 'Integration tests', ->

    it 'should call CustomerSettings.getLabelHourFromValue with the given input', ->
      input = '23:00:00';
      $filter('timeLabel')(input).should.equal '23h00'
