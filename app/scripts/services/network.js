'use strict';

angular.module('groupeat.services.network', [])

/*global Connection:true*/
.service('Network', function() {

	var hasConnectivity = function() {
    // If we are on a computer, this will not be defined and we return true
    if (!window.Connection)
    {
      return true;
    }
		return (navigator.connection.type !== Connection.NONE);
	};

	return {
    hasConnectivity: hasConnectivity
	};
}
);
