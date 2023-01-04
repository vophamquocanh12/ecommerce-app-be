const routes = require('express').Router();

const categoryRoutes = require('../controllers/CategoryController')

routes.get('/', categoryRoutes.findAll)
routes.get('/:id', categoryRoutes.findId)
routes.get('/question/find', categoryRoutes.searchByName)
routes.post('/', categoryRoutes.addCategory)
routes.put('/:id', categoryRoutes.updateCategory)
routes.delete('/:id', categoryRoutes.deleteCategory)


module.exports = routes