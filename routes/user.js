const router = require('express').Router();

const userController = require('../controllers/UserController')

router.get('/', userController.getAll)
router.get('/:id', userController.getById)
router.get('/find/admins', userController.getAllAdmin)
router.get('/find/customers', userController.getAllCustomers)
router.get('/find/providers', userController.getAllProviders)

router.get('/customers/search', userController.searchByNameCustomers)
router.get('/providers/search', userController.searchByNameProviders)

router.post('/login', userController.login)
router.post('/register',userController.register)

router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router