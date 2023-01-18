const routes = require('express').Router();

const productController = require('../controllers/ProductController')

routes.get('/', productController.getAll)
routes.get('/:id', productController.getById)

routes.get('/question/search', productController.searchByName)

routes.post('/', productController.addProduct)
routes.put('/:id', productController.updateProduct)
routes.delete('/:id', productController.deleteProduct)

module.exports = routes