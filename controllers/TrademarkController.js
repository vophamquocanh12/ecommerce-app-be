const { Trademarks } = require('../model/model')

const trademarkController = {
    // get all trademarks
    findAll: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const trademarks = await Trademarks.paginate(
                    {},
                    {
                        page: req.query.page || 1,
                        limit: req.query.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )

                const { docs, ...others } = trademarks
                res.status(200).json({
                    data: docs,
                    ...others,
                })
            } else {
                const trademarks = await Trademarks.find({}).sort({
                    createdAt: -1,
                })
                res.status(200).json(trademarks)
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // get a trademark
    findById: async (req, res) => {
        try {
            const trademark = await Trademarks.findById(req.params.id).populate(
                'products',
            )
            if (trademark) {
                res.status(200).json(trademark)
            } else {
                res.status(404).json({
                    message: 'Trademark not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // search name trademark
    searchByName: async (req, res) => {
        try {
            const name = req.query.name
            const check = RegExp(name, 'i')
            const trademarks = await Trademarks.find({ name: check })
                .populate('products')
                .exec()
            if (trademarks) {
                res.status(200).json(trademarks)
            } else {
                res.status(404).json({
                    message: 'Trademark name not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // add trademark
    addTrademark: async (req, res) => {
        try {
            const trademark = await Trademarks.create(req.body)
            res.status(200).json({
                message: 'Trademark add successful!',
            })
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Add trademark failed!',
            })
        }
    },

    // update trademark
    updateTrademark: async (req, res) => {
        try {
            const trademark = await Trademarks.findById(req.params.id)
            await trademark.updateOne({ $set: req.body })
            if (trademark) {
                res.status(200).json({
                    message: 'Update trademark successful!',
                })
            } else {
                res.status(404).json({
                    message: 'Trademark not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Update trademark failed!',
            })
        }
    },

    // delete trademark
    deleteTrademark: async (req, res) => {
        try {
            const trademark = await Trademarks.findById(req.params.id)
            if (trademark) {
                if (trademark.get('products').length > 0) {
                    res.status(400).json({
                        message: 'Trademark has products!',
                    })
                } else {
                    await trademark.remove()
                    res.status(500).json({
                        message: 'Deleted the trademark successful!',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Delete trademark failed!',
            })
        }
    },
}

module.exports = trademarkController
