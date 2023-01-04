const routes = require('express').Router();

const userRoutes = require('../controllers/UserController')

routes.post('/login', userRoutes.login)
routes.post('/register',userRoutes.register)

module.exports = routes