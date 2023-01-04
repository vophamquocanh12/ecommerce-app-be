const routes = require('express').Router();

const productRoutes = require('../controllers/ProductController')

routes.get('/', productRoutes.getAllProducts)

module.exports = routes