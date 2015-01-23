'use strict';

angular.module('groupeat.services.order', [])

.service('Order',
	function() {
	
		var currentOrder = {
				'groupOrderId': null,
				'timeLeft': null,
				'currentDiscount': null
			};

		var getCurrentOrder = function() {
			return currentOrder;
		};

		var resetCurrentOrder = function() {
			currentOrder = {
				'groupOrderId': null,
				'timeLeft': null,
				'currentDiscount': null
			};
		};

		var setGroupOrderId = function(id) {
			currentOrder.groupOrderId = id;
		};

		var setTimeLeft = function(time) {
			currentOrder.timeLeft = time;
		};

		var setCurrentDiscount = function(discount) {
			currentOrder.currentDiscount = discount;
		};

		var setCurrentOrder = function(id, time, discount) {
			currentOrder.groupOrderId = id;
			currentOrder.timeLeft = time;
			currentOrder.currentDiscount = discount;
		};


		return {
			getCurrentOrder: getCurrentOrder,
			resetCurrentOrder: resetCurrentOrder,
			setGroupOrderId: setGroupOrderId,
			setTimeLeft: setTimeLeft,
			setCurrentDiscount: setCurrentDiscount,
			setCurrentOrder: setCurrentOrder
		};
	}
);