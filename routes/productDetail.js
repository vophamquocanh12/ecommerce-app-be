const router = require('express').Router();

const productDetailController = require('../controllers/ProductDetailController')

router.post('/', productDetailController.create);
router.put('/:id', productDetailController.update);
router.delete('/:id', productDetailController.delete);

module.exports = router