const router = require('express').Router();

const trademarkController = require('../controllers/TrademarkController')

router.get('/', trademarkController.getAll)
router.get('/:id', trademarkController.getById)

router.get('/question/search', trademarkController.searchByName)

router.post('/', trademarkController.addTrademark)
router.put('/:id', trademarkController.updateTrademark)
router.delete('/:id', trademarkController.deleteTrademark)

module.exports = router