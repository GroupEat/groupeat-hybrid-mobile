'use strict';

angular.module('groupeat.services.order', [
	'groupeat.services.backend-utils',
	'groupeat.services.lodash',
	'ngConstants',
	'ngResource'
])

.service('Order', function($q, $resource, apiEndpoint, BackendUtils, _) {

	var fromGroupOrderResource = $resource(apiEndpoint+'/customers/:customerId/groupOrders/:groupOrderId/orders?include=restaurant'),
	forCustomerResource = $resource(apiEndpoint+'/customers/:customerId/orders?include=groupOrder.restaurant,productFormats');

	var
	currentOrder = {
		'groupOrderId': null,
		'endingAt': null,
		'currentDiscount': null,
		'groupOrderDiscount': null,
		'remainingCapacity': null,
		'discountPolicy': null,
		'groupOrderTotalPrice': 0
	},

	requestBody = {
		'id': null,
		'foodRushDurationInMinutes': null,
		'productFormats': {},
		'deliveryAddress': {
			'street': null,
			'details': null,
			'latitude': null,
			'longitude': null
		},
		'comment': null
	},

	getRequestBody = function() {
		return requestBody;
	},

	isNewOrder = function() {
		var response ;
		if (!currentOrder.groupOrderId) {
			response = true;
		}
		else {
			response = false;
		}
		return response;
	},

	setGroupOrderId = function(value) {
		requestBody.groupOrderId = value;
	},
	setFoodRushTime = function(value) {
		requestBody.foodRushDurationInMinutes = value;
	},
	setProductFormats = function(value) {
		requestBody.productFormats = value;
	},
	setStreet = function(value) {
		requestBody.deliveryAddress.street = value;
	},
	setDetails = function(value) {
		requestBody.deliveryAddress.details = value;
	},
	setLatitude = function(value) {
		requestBody.deliveryAddress.latitude = value;
	},
	setLongitude = function(value) {
		requestBody.deliveryAddress.longitude = value;
	},

	setComment = function(value) {
		requestBody.comment = value;
	},

	setCurrentDiscount = function (newDiscount) {
		currentOrder.currentDiscount = newDiscount;
	},

	getCurrentDiscount = function () {
		return currentOrder.currentDiscount ;
	},

	/*
	The next function compute the discount with the discount policy
	Being linear piecewise, we just need the two values given by the
	restaurant between which the total price of cart is. Then, with
	some maths, we can compute the discount for this total price.
	Formula :
	y = A.(x+Xgo) + y1 - A.x1
	with A = (y1 - y2)/(x1 - x2), y the unknown discount,
	Xgo the total price from the joined group order : Xgo = (Ygo - Bgo)/Ago
	and x the current totalPrice
	*/
	computeDiscount = function (discount1, discount2, price1, price2, totalPrice) {
		if (price1 === price2) {
			return discount2;
		}
		else {
			return (totalPrice*(discount1-discount2)/(price1-price2) + discount1 - price1*(discount1-discount2)/(price1-price2));
		}
	},

	updateCurrentDiscount = function (totalPrice) {
		/*
		Algorithm has to be improved : function of last current discount,
		we know the interval in which the total price must be...
		*/
		if (totalPrice !== 0) {
			if (currentOrder.groupOrderId !== null) {
				totalPrice = totalPrice + currentOrder.groupOrderTotalPrice;
			}
			var newDiscount;
			var priceDown = 0;
			var completeDiscountPolicy = currentOrder.discountPolicy;
			completeDiscountPolicy['0'] = 0;
			var discountPricesHundred = _.keys(completeDiscountPolicy);
			var discountPrices = [] ;
			for (var i=0 ; i < _.size(discountPricesHundred) ; i++) {
				discountPrices[i] = parseInt(discountPricesHundred[i])/100 ;
			}

			var priceUp = _.max(discountPrices);
			// We find the interval in which is the total price
			for(i=0 ; i < _.size(discountPrices) ; i++) {
				if(totalPrice >= discountPrices[i]) {
					priceDown = _.max([discountPrices[i], priceDown]);
				}
				if(totalPrice <= discountPrices[i]) {
					priceUp = _.min([discountPrices[i], priceUp]);
				}
			}

			var priceUpHundred = (priceUp*100).toString();
			var priceDownHundred = (priceDown*100).toString();

			// Compute the new discount, and set it
			newDiscount = computeDiscount(completeDiscountPolicy[priceUpHundred], completeDiscountPolicy[priceDownHundred], priceUp, priceDown, totalPrice);
			setCurrentDiscount(newDiscount);
		}
		else {
			if(!currentOrder.groupOrderId) {
				setCurrentDiscount(0);
			}
			else {
				setCurrentDiscount(currentOrder.groupOrderDiscount);
			}
		}
	},

	getFoodRushTime = function() {
		return requestBody.foodRushDurationInMinutes;
	},

	getCurrentOrder = function() {
		return currentOrder;
	},

	resetCurrentOrder = function() {
		currentOrder = {
			'groupOrderId': null,
			'endingAt': null,
			'currentDiscount': null,
			'remainingCapacity': null
		};
		requestBody = {
			'id': null,
			'foodRushDurationInMinutes': null,
			'productFormats': {},
			'deliveryAddress': {
				'street': null,
				'details': null,
				'latitude': null,
				'longitude': null
			},
			'comment': null
		};
	},

	setCurrentOrder = function(id, date, discount, capacity, discountPolicy, groupOrderTotalPrice) {
		requestBody.id = id;
		currentOrder.groupOrderId = id;
		currentOrder.endingAt = date;
		currentOrder.groupOrderDiscount = discount;
		currentOrder.currentDiscount = discount;
		currentOrder.remainingCapacity = capacity;
		currentOrder.discountPolicy = discountPolicy;
		currentOrder.groupOrderTotalPrice = groupOrderTotalPrice/100;
	},

	save = function() {
		var defer = $q.defer();
		var resource;
		if (currentOrder.groupOrderId === null) {
			resource = $resource(apiEndpoint+'/orders');
		}
		else {
			resource = $resource(apiEndpoint+'/groupOrders/' + requestBody.id + '/orders');
		}
		resource.save(requestBody).$promise
		.then(function(response) {
			defer.resolve(response);
		})
		.catch(function(errorResponse) {
			defer.reject(BackendUtils.errorMsgFromBackend(errorResponse));
		});
		return defer.promise;
	},

	getTimeDiff = function(endingTime) {
		var response = null;
		if(endingTime !== null) {
			var currentTime = new Date();
			if (!(endingTime instanceof Date))
			{
				endingTime = new Date(endingTime.replace(/-/g, '/'));
			}
			response = Math.abs(endingTime - currentTime)/1000;
		}
		return response;
	},

	get = function(orderId) {
		var defer = $q.defer();
		var resource = $resource(apiEndpoint+'/orders/:id');
		resource.get({id: orderId}).$promise
		.then(function(response) {
			defer.resolve(response.data);
		})
		.catch(function() {
			defer.reject();
		});
		return defer.promise;
	},

	queryForGroupOrder = function(customerId, groupOrderId) {
	var defer = $q.defer();
	fromGroupOrderResource.get({customerId: customerId, groupOrderId: groupOrderId}).$promise
	.then(function(response) {
		defer.resolve(response.data);
	})
	.catch(function() {
		defer.reject();
	});
	return defer.promise;
	},

	queryForCustomer = function(customerId) {
		var defer = $q.defer();
		forCustomerResource.get({customerId: customerId}).$promise
		.then(function(response) {
			var orders = [], oldOrders = [];
			_.forEach(response.data, function(rawOrder) {
				var order = {'discountedPrice': rawOrder.discountedPrice/100};
				order.discount = 100*(rawOrder.rawPrice-rawOrder.discountedPrice)/rawOrder.rawPrice;
				order.restaurant = rawOrder.groupOrder.data.restaurant.data.name;
				order.closedAt = rawOrder.groupOrder.data.closedAt ? rawOrder.groupOrder.data.closedAt : null;
				order.endingAt = rawOrder.groupOrder.data.endingAt;
				order.productFormats = rawOrder.productFormats.data;
				order.totalPrice = rawOrder.rawPrice;
				order.comment = rawOrder.comment;
				if (order.closedAt)
				{
					oldOrders.push(order);
				}
				else
				{
					orders.push(order);
				}
			});
			defer.resolve(orders.concat(_.sortByOrder(oldOrders, ['closedAt'], [false])));
		})
		.catch(function() {
			defer.reject();
		});
		return defer.promise;
	};

	return {
		get: get,
		getCurrentOrder: getCurrentOrder,
		queryForGroupOrder: queryForGroupOrder,
		queryForCustomer: queryForCustomer,
		getRequestBody: getRequestBody,
		setGroupOrderId: setGroupOrderId,
		setFoodRushTime: setFoodRushTime,
		setProductFormats: setProductFormats,
		setStreet: setStreet,
		setDetails: setDetails,
		setLatitude: setLatitude,
		setLongitude: setLongitude,
		setComment: setComment,
		resetCurrentOrder: resetCurrentOrder,
		setCurrentOrder: setCurrentOrder,
		save: save,
		updateCurrentDiscount: updateCurrentDiscount,
		isNewOrder: isNewOrder,
		getTimeDiff: getTimeDiff,
		getFoodRushTime: getFoodRushTime,
		getCurrentDiscount: getCurrentDiscount
	};
});
