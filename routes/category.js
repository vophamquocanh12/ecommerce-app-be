const router = require('express').Router()

const categoryController = require('../controllers/CategoryController')

router.get('/', categoryController.getAll)
router.get('/:id', categoryController.getById)

router.get('/question/search', categoryController.searchByName)

router.post('/', categoryController.addCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)

module.exports = router
