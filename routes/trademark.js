const router = require('express').Router();

const trademarkController = require('../controllers/TrademarkController')

router.get('/', trademarkController.findAll)
router.get('/:id', trademarkController.findById)

router.get('/question/find', trademarkController.searchByName)

router.post('/', trademarkController.addTrademark)
router.put('/:id', trademarkController.updateTrademark)
router.delete('/:id', trademarkController.deleteTrademark)

module.exports = router