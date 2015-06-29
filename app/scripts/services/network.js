'use strict';

angular.module('groupeat.services.network', [])

/*global Connection:true*/
.service('Network', function($q) {

	var hasConnectivity = function() {
		var deferred = $q.defer();
		// If we are on a computer, this will not be defined and we return true
		if (!window.Connection || navigator.connection.type !== Connection.NONE) {
			deferred.resolve();
		} else {
			deferred.reject('noNetwork');
		}
		return deferred.promise;
	};

	return {
		hasConnectivity: hasConnectivity
	};
});
