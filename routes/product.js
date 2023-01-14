const routes = require('express').Router();

const productRoutes = require('../controllers/ProductController')

routes.get('/', productRoutes.findAll)
routes.get('/:id', productRoutes.findById)
routes.get('/question/find', productRoutes.searchByName)
routes.post('/', productRoutes.addProduct)
routes.put('/:id', productRoutes.updateProduct)
routes.delete('/:id', productRoutes.deleteProduct)

module.exports = routes