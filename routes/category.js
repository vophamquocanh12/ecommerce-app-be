const router = require('express').Router()

const categoryController = require('../controllers/CategoryController')

router.get('/', categoryController.findAll)
router.get('/:id', categoryController.findById)

router.get('/question/find', categoryController.searchByName)

router.post('/', categoryController.addCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router
