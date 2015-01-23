'use strict';

angular.module('groupeat.services.cart', ['groupeat.services.lodash'])

.service('Cart',
	function(_) {
	
		var products = {
				'cartTotalPrice': 0,
				'cartTotalQuantity': 0,
				'cartDiscount': 0,
				'productsItems': []
			};

		var refreshCart = function() {
			// create index variable to store index of product to be potentially removed from cart
			var indexOfProductToBeDeleted = [false, 0];
			// update cart
			products.cartTotalPrice = 0 ;
			products.cartTotalQuantity = 0 ;

			_.forEach(products.productsItems, function(product) {
				product.totalQuantity = 0 ;
				product.totalPrice = 0 ;

				_.forEach(product.formats, function(productFormats) {
					product.totalPrice += productFormats.price*productFormats.quantity ;
					product.totalQuantity += productFormats.quantity ;
				});
				products.cartTotalPrice += product.totalPrice ;
				products.cartTotalQuantity += product.totalQuantity ;
				if (product.totalQuantity === 0) {
					indexOfProductToBeDeleted = [true, _.indexOf(product)];
				}
			});

			// remove potentially a product if total quantity has been seen as 0
			if (indexOfProductToBeDeleted[0]) {
				products.productsItems.splice(indexOfProductToBeDeleted[1] - 1, 1);
			}
		};

		var getCart = function(){
	      return products;
			};

		var removeProductFromCart = function(productToDelete, formatIndex) {
			// Find product in products and decrement its quantity
			_.forEach(products.productsItems, function(product) {
				if (product.id === productToDelete.id) {

					_.forEach(product.formats, function(productFormats) {
						if(productFormats.id === formatIndex && productFormats.quantity > 0) {
							productFormats.quantity -= 1 ;
						}
						else {}
					});
				}
				else {}
			});
			refreshCart();
		};

		var addProductToCart = function(productToAdd, format) {

			// Test if productToAdd exists already in products
			var IsInProducts = false ;
			_.forEach(products.productsItems, function(product){
				if (product.id === productToAdd.id) {
					IsInProducts = true;
				}
			});
			if ( IsInProducts ) {
				// If productTo<Add already exists in products, just increment its quantity
				_.forEach(products.productsItems, function(product) {
					if (product.id === productToAdd.id) {
						_.forEach(product.formats, function(productFormats) {
							if(productFormats.id === format.id) {
								productFormats.quantity += 1 ;
							}
							else {}
						});
					}
				});
			}
			else {
				// Else, create new product to add in products.productsItems
				
				// First the formats array
				var formatToAddInProduct = [];
				for(var i=0 ; i < _.size(productToAdd.formats) ; i++) {
					formatToAddInProduct[i] = {
						'id': productToAdd.formats[i].id,
						'size': productToAdd.formats[i].size,
						'price': productToAdd.formats[i].price*((100-products.cartDiscount)/100),
						'quantity': 0
					};
					if (formatToAddInProduct[i].id === format.id) {
						// set quantity of productToAdd at 1 (in right format)
						formatToAddInProduct[i].quantity = 1 ;
					}
				}
				
				// Then the product to add
				var productToAddInProducts = {
						'id': productToAdd.id,
						'name': productToAdd.name,
						'totalQuantity': 1,
						'totalPrice': format.price,
						'formats': formatToAddInProduct
					};

				products.productsItems.splice(1, 0, productToAddInProducts);
			}

			refreshCart();
		};

		var resetCart = function() {
			products.cartTotalQuantity = 0 ;
			products.cartTotalPrice = 0 ;
			products.cartDiscount = 0;
			products.productsItems = [];
		};

		return {
			addProductToCart: addProductToCart,
			getCart: getCart,
			removeProductFromCart: removeProductFromCart,
			refreshCart: refreshCart,
			resetCart: resetCart
		};
	}
);