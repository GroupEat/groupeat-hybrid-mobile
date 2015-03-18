'use strict';

angular.module('groupeat.services.product', [
  'groupeat.services.backend-utils',
  'groupeat.services.lodash'
])

.factory('Product', function($resource, ENV, $q, _) {

  var resource = $resource(ENV.apiEndpoint+'/restaurants/:restaurantId/products?include=formats');

  var /**
  * @ngdoc function
  * @name Product#get
  * @methodOf Product
  *
  * @description
  * Returns the list of products for a given restaurant id
  * if rejected, an error message in proper locale will be rejected
  * https://groupeat.fr/docs
  *
  */
  get = function(restaurantId) {
    var defer = $q.defer();
    resource.get({restaurantId: restaurantId}).$promise
    .then(function(response) {
      var products = response.data;
      _.forEach(products, function(product) {
        _.forEach(product.formats.data, function(format) {
          format.price = format.price / 100 ;
        });
      });
      defer.resolve(products);
    })
    .catch(function() {
      defer.reject();
    });
    return defer.promise;
  };

  return {
    get: get
  };
});
