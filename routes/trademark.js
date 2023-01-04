const routes = require('express').Router();

const trademarkRoutes = require('../controllers/TrademarkController')

routes.get('/', trademarkRoutes.findAll)
routes.get('/:id', trademarkRoutes.findId)
routes.get('/question/find', trademarkRoutes.searchByName)
routes.post('/', trademarkRoutes.addTrademark)
routes.put('/:id', trademarkRoutes.updateTrademark)
routes.delete('/:id', trademarkRoutes.deleteTrademark)

module.exports = routes