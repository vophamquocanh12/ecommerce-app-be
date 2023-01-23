const router = require('express').Router();

const sizeController = require('../controllers/SizeController')

router.get("/", sizeController.getAll)

router.post("/", sizeController.addSize)
router.put("/:id", sizeController.updateSize)
router.delete("/:id", sizeController.deleteSize)

module.exports = router