'use strict';

angular.module('groupeat.services.cart', [])

.service('Cart', function() {
	var cart = [
		{
			'name': 'Margherita',
			'id': 1,
			'mediumPrice': 10,
			'formats':
			[
				{
					'id': 1,
					'size':'Junior',
					'price':8,
					'quantity': 1
				},
				{
					'id': 2,
					'size':'Senior',
					'price':10,
					'quantity': 0
				},
				{
					'id': 3,
					'size':'Mega',
					'price':12,
					'quantity': 1
				}
			]
		}
	];

	var addProductToCart = function(newObj) {
      cart.splice(-1, 0, newObj);
		};

	var getCart = function(){
      return cart;
		};

	var removeProductFromCart = function(index){
		cart.splice(index,1) ;
	};

	return {
		addProductToCart: addProductToCart,
		getCart: getCart,
		removeProductFromCart: removeProductFromCart
	};

});