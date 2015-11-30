'use strict';
angular.module('groupeat.filters.time-label', [
])

.filter('timeLabel', function (CustomerSettings) {
	return function(input) {
		return CustomerSettings.getLabelHourFromValue(input);
	};
});
