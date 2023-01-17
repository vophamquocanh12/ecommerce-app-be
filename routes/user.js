const router = require('express').Router();

const userController = require('../controllers/UserController')

router.get('/', userController.findAll)
router.get('/find/customers', userController.findCustomers)
router.get('/find/providers', userController.findProviders)

router.post('/login', userController.login)
router.post('/register',userController.register)

module.exports = router