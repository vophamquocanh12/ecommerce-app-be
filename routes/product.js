const routes = require('express').Router();

const productController = require('../controllers/ProductController')

routes.get('/', productController.findAll)
routes.get('/:id', productController.findById)

routes.get('/question/find', productController.searchByName)

routes.post('/', productController.addProduct)
routes.put('/:id', productController.updateProduct)
routes.delete('/:id', productController.deleteProduct)

module.exports = routes