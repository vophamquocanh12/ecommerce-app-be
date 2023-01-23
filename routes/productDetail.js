const router = require('express').Router();

const productDetailController = require('../controllers/ProductDetailController')

router.post('/', productDetailController.addProductDetail);
router.put('/:id', productDetailController.updateProductDetail);
router.delete('/:id', productDetailController.deleteProductDetail);

module.exports = router