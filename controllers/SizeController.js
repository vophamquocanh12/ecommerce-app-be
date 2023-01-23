const { Sizes, ProductDetails } = require('../model/model')

const sizeController = {
    getAll: async (req, res) => {
        try {
            const sizes = await Sizes.find()
            res.status(200).json(sizes)
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    searchBySize: async (req, res) => {
        try {
            const size = req.query.size
            const check = RegExp(size, 'i')
            const sizes = await Sizes.find({size: check}).populate('productDetails').exec()
            if(sizes){
                res.status(200).json(sizes)
            }else{
                res.status(404).json({
                    message: 'Size not found!'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error.message,
            }) 
        }
    },

    addSize: async (req, res) => {
        try {
            const productDetail = ProductDetails.findById(
                req.body.ProductDetails,
            )
            if (productDetail) {
                const size = new Sizes(req.body)
                const result = await size.save()
                await productDetail.updateOne({ $push: { size: result._id } })
                res.status(200).json({
                    message: 'Size add successful!',
                })
            } else {
                res.status(404).json({
                    message: 'Product detail not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Add size failed!',
            })
        }
    },

    updateSize: async (req, res) => {
        try {
            const size = await Sizes.findById(req.body.id)
            if (size) {
                const oldPD = await ProductDetails.findById(
                    size.get('productDetails'),
                )

                const productDetail = await ProductDetails.findById(
                    req.body.productDetail,
                )

                if (productDetail) {
                    await Sizes.findByIdAndUpdate(req.params.id, req.body)

                    await oldPD.updateOne({
                        $pull: {
                            size: size.get('_id'),
                        },
                    })

                    await productDetail.updateOne({
                        $push: {
                            size: size.get('_id'),
                        },
                    })

                    res.status(200).json({
                        message: 'Update size successful!',
                    })
                } else {
                    res.status(404).json({
                        message: 'Product detail not found!',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Update size failed!',
            })
        }
    },

    deleteSize: async (req, res) => {
        try {
            const size = await Sizes.findById(req.params.id)
            if (size) {
                if (size.get('productDetails').length > 0) {
                    res.status(400).json({
                        message: 'Size há product detail!',
                    })
                } else {
                    const productDetail = await ProductDetails.findById(
                        size.get('productDetails'),
                    )
                    await productDetail.updateOne({ $pull: size.get('_id') })
                    await size.remove()
                    res.status(200).json({
                        message: 'Deleted size successful!',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Delete size failed!',
            })
        }
    },
}

module.exports = sizeController
