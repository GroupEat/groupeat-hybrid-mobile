describe 'Service: Cart', ->

  # Load the controller's module
  beforeEach ->
    module 'groupeat.services.cart'
    module 'templates'

  Cart = scope = $httpBackend = {}

  # Initialize the controller and a mock scope
  beforeEach ->
    inject ($rootScope, $injector) ->
      scope = $rootScope.$new()
      $httpBackend = $injector.get('$httpBackend')
      $httpBackend.whenGET(/^translations\/.*/).respond('{}')
      Cart = $injector.get('Cart')
      _ = $injector.get('_')

  describe 'products setter and getter', ->

    it 'getProducts should initially return an empty object', ->
      Cart.getProducts().should.be.empty

    it 'getProducts should return the object set by setProducts', ->
      products = ['firstProduct', 'secondProduct']
      Cart.setProducts(products)
      Cart.getProducts().should.equal(products)

  describe 'totalQuantity setter and getter', ->

    it 'getTotalQuantity should initially return 0', ->
      Cart.getTotalQuantity().should.equal(0)

    it 'getTotalQuantity should return the value set by setTotalQuantity', ->
      totalQuantity = 2
      Cart.setTotalQuantity(totalQuantity)
      Cart.getTotalQuantity().should.equal(totalQuantity)

  describe 'totalPrice setter and getter', ->

    it 'getTotalPrice should initially return 0', ->
      Cart.getTotalPrice().should.equal(0)

    it 'getTotalPrice should return the value set by setTotalPrice', ->
      totalPrice = 100
      Cart.setTotalPrice(totalPrice)
      Cart.getTotalPrice().should.equal(totalPrice)

  describe 'discountRate setter and getter', ->

    it 'getDiscountRate should initially return 0', ->
      Cart.getDiscountRate().should.equal(0)

    it 'getTotalPrice should return the value set by setTotalPrice', ->
      discountRate = 0.3
      Cart.setDiscountRate(discountRate)
      Cart.getDiscountRate().should.equal(discountRate)

  describe 'Cart#getFormatQuantity', ->

    it 'should return 0 if there are no products', ->
      Cart.getFormatQuantity(2014).should.equal(0)

    it 'should return 0 if there are only products with no format', ->
      products = [
        formats: []
      ]
      Cart.setProducts(products)
      Cart.getFormatQuantity(2014).should.equal(0)

    it 'should return 0 if there are no formats matching the given format id', ->
      products = [
        formats: [
          {id: 1},
          {id: 2}
        ]
      ]
      Cart.setProducts(products)
      Cart.getFormatQuantity(2014).should.equal(0)

    it 'should return 0 if there is a format matching the given format id and if it has no quantity property', ->
      products = [
        formats: [
          {id: 1},
          {id: 2014}
        ]
      ]
      Cart.setProducts(products)
      Cart.getFormatQuantity(2014).should.equal(0)

    it 'should return the quantity of the format matching the given format id if it has the quantity property', ->
      products = [
        formats: [
          {id: 1},
          {id: 2014, quantity: 2}
        ]
      ]
      Cart.setProducts(products)
      Cart.getFormatQuantity(2014).should.equal(2)

  describe "Cart Service contents :", ->
    it "should create an objet of products", ->
      expect(Cart).not.to.equal(null)

  describe "Cart Service methods :", ->

    afterEach () ->
      scope.$apply()

    it "should return cart", ->
      previousCart = Cart
      Cart.refresh()
      expect(Cart).to.equal(previousCart)

    it "should refresh empty cart", ->
      Cart.setTotalPrice(Cart.getTotalPrice()+10)
      Cart.setTotalQuantity(Cart.getTotalQuantity()+1)
      Cart.setProducts([{}])

      Cart.refresh()
      expect(Cart.getTotalPrice()).to.equal(0)
      expect(Cart.getTotalQuantity()).to.equal(0)

    it "refresh should update prices and quantities of cart and childrens", ->
      Cart.setProducts([
        {
          id: 12,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              size: 'test size 1',
              price: 10,
              quantity: 2
            }
            ,
            {
              id: 2,
              size: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
        id: 5,
        name: 'test name',
        totalQuantity: 2222,
        totalPrice: 1222,
        formats: [
            {
              id: 6,
              size: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              size: 'test size 2',
              price: 15,
              quantity: 2
            }
          ]
        }
      ])

      Cart.refresh()

      expect(Cart.getProducts()[0].totalQuantity).to.equal(3)
      expect(Cart.getProducts()[1].totalQuantity).to.equal(4)
      expect(Cart.getProducts()[0].totalPrice).to.equal(35)
      expect(Cart.getProducts()[1].totalPrice).to.equal(50)

      expect(Cart.getTotalQuantity()).to.equal(7)
      expect(Cart.getTotalPrice()).to.equal(85)

    it "should delete productsItems when a product total quantity equals 0", ->
      Cart.setProducts([
        {
        id: 12,
        name: 'test name',
        totalQuantity: 22,
        totalPrice: 1222,
        formats: [
            {
              id: 1,
              name: 'test size 1',
              price: 10,
              quantity: 0
            },
            {
              id: 2,
              name: 'test size 2',
              price: 15,
              quantity: 0
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              name: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              name: 'test size 2',
              price: 15,
              quantity: 2
            }
          ]
        }
      ])

      Cart.refresh()

      Cart.getProducts().should.have.length(1)

    it "should remove product by decreasing quantity", ->

      Cart.setProducts([
        {
          id: 12,
          name: 'test name',
          totalQuantity: 22,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              name: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 2,
              name: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              name: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              name: 'test size 2',
              price: 15,
              quantity: 2 # quantity to decrease
            }
          ]
        }
      ])

      Cart.removeProduct(Cart.getProducts()[1], Cart.getProducts()[1].formats[1].id)
      expect(Cart.getProducts()[1].formats[1].quantity).to.equal(1)

    it "should reset cart", ->
      Cart.setTotalPrice(111)
      Cart.setTotalQuantity(555)
      Cart.setProducts([
        'id': 12,
        'name': 'test name',
        'totalQuantity': 22,
        'totalPrice': 1222,
        'formats': [
            'id': 1,
            'name': 'test size 1',
            'price': 10,
            'quantity': 2
            ,
            'id': 2,
            'name': 'test size 2',
            'price': 15,
            'quantity': 1
          ]
        ,
        'id': 5,
        'name': 'test name',
        'totalQuantity': 2222,
        'totalPrice': 1222,
        'formats': [
            'id': 6,
            'name': 'test size 1',
            'price': 10,
            'quantity': 2
            ,
            'id': 7,
            'name': 'test size 2',
            'price': 15,
            'quantity': 2 # quantity to decrease
          ]
      ])

      Cart.reset()

      expect(Cart.getTotalQuantity()).to.equal(0)
      expect(Cart.getTotalPrice()).to.equal(0)
      Cart.getProducts().should.have.length(0)

    it "should add an existing product", ->
      Cart.setProducts([
        {
          id: 12,
          name: 'test name',
          totalQuantity: 22,
          totalPrice: 1222,
          formats: [
            {
              id: 1,
              name: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 2,
              name: 'test size 2',
              price: 15,
              quantity: 1
            }
          ]
        },
        {
          id: 5,
          name: 'test name',
          totalQuantity: 2222,
          totalPrice: 1222,
          formats: [
            {
              id: 6,
              name: 'test size 1',
              price: 10,
              quantity: 2
            },
            {
              id: 7,
              name: 'test size 2',
              price: 15,
              quantity: 2 # quantity to increase
            }
          ]
        }
      ])

      productToAdd = # data coming from restaurant menu alias pizzas*.json
        name: 'test name',
        id: 5, # same product id as above
        description: 'test description',
        formats:[
            {
              id: 10,
              name:'Junior',
              price:8
            },
            {
              id: 7, # same format id as above
              name:'Senior',
              price:10
            }
        ]

      Cart.addProduct(productToAdd, productToAdd.formats[1])
      expect(Cart.getProducts()[1].formats[1].quantity).to.equal(3)

    it "should add a new product in cart", ->

      productToAdd = # data coming from restaurant menu alias pizzas*.json
        name: 'test name',
        id: 5,
        description: 'test description',
        formats: {
          data: [
            {
              id: 10,
              name:'Junior',
              price:8
            },
            {
              id: 7, # format to add for test
              name:'Senior',
              price:10
            }
          ]
        }

      Cart.addProduct(productToAdd, productToAdd.formats.data[1])

      # test if data from restaurant (above) has been added to CART (different structures)
      Cart.getProducts().should.have.length(1)

      firstProduct = Cart.getProducts()[0]

      expect(firstProduct.id).to.equal(5)
      expect(firstProduct.name).to.equal('test name')
      firstProduct.should.have.property('totalPrice') # dont care of value because will be update by refresh, which has been tested
      firstProduct.should.have.property('totalQuantity')
      firstProduct.formats.should.have.length(2)

      expect(firstProduct.formats[0].id).to.equal(10)
      expect(firstProduct.formats[1].id).to.equal(7)

      expect(firstProduct.formats[0].name).to.equal('Junior')
      expect(firstProduct.formats[1].name).to.equal('Senior')

      expect(firstProduct.formats[0].price).to.equal(8)
      expect(firstProduct.formats[1].price).to.equal(10)

      firstProduct.formats[0].should.have.property('quantity')
      firstProduct.formats[1].should.have.property('quantity')
