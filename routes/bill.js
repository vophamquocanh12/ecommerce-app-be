const routes = require('express').Router();

const billRoutes = require('../controllers/BillController')

routes.get('/', billRoutes.getAllBills)

module.exports = routes