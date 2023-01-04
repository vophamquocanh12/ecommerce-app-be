const routes = require('express').Router();

const billDetailRoutes = require('../controllers/BillDetailController')

routes.get('/', billDetailRoutes.getAllBillDetails)

module.exports = routes