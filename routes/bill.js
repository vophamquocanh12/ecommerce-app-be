const router = require('express').Router();

const billController = require('../controllers/BillController')

router.get('/', billController.findAll)

module.exports = router