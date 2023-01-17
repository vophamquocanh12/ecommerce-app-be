const {
    Categories,
    Trademarks,
    Products,
    BillDetails,
    Bills,
    Actions,
    Comments,
    ProductDetails,
    Sizes,
} = require('../model/model')

const isNumber = require('is-number')

const productController = {
    // get all products
    findAll: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const products = await Products.paginate(
                    {},
                    {
                        page: req.query.page || 1,
                        limit: req.query.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )
                let data = []
                const { docs, ...others } = products
                docs.forEach((product) => {
                    const productDetails = product.productDetails
                    let rating = 0
                    let fiveStar = 0
                    let fourStar = 0
                    let threeStar = 0
                    let twoStar = 0
                    let oneStar = 0
                    let sold = 0
                    let totalComments = 0

                    for (const productDetail of productDetails) {
                        const billDetails = productDetail.billDetails
                        for (const billDetail of billDetails) {
                            const bill = billDetail.bill
                            if (bill.type === 'X') {
                                sold += billDetail.quantity
                            }
                        }
                        const comments = productDetail.comments
                        for (let index in comments) {
                            if (comments[index].star > 0) totalComments += 1
                            comments[index].star === 5
                                ? (fiveStar += 1)
                                : comments[index].star === 4
                                ? (fourStar += 1)
                                : comments[index].star === 3
                                ? (threeStar += 1)
                                : comments[index].star === 2
                                ? (twoStar += 1)
                                : comments[index].star === 1
                                ? (oneStar += 1)
                                : null
                            rating += comments[index].star
                        }
                    }

                    rating /= totalComments
                    const productObject = product.toObject()
                    productObject.rating = rating > 5 ? 5 : rating
                    productObject.numberOfComments = totalComments
                    productObject.fiveStar = fiveStar
                    productObject.fourStar = fourStar
                    productObject.threeStar = threeStar
                    productObject.twoStar = twoStar
                    productObject.oneStar = oneStar
                    productObject.sold = sold
                    data.push(productObject)
                })

                res.status(200).json(data)
            } else {
                const products = await Products.find({}).sort({
                    createdAt: -1,
                })
                let data = []
                for (const product of products) {
                    let rating = 0
                    let fiveStar = 0
                    let fourStar = 0
                    let threeStar = 0
                    let twoStar = 0
                    let oneStar = 0
                    let sold = 0
                    let totalComments = 0

                    const productDetails = product.productDetails
                    for (const productDetail of productDetails) {
                        const billDetails = productDetail.billDetails
                        for (const billDetail of billDetails) {
                            const bill = billDetail.bill
                            if (bill.type === 'X') {
                                sold += billDetail.quantity
                            }
                        }
                        const comments = productDetail.comments
                        for (let index in comments) {
                            if (comments[index].star > 0) totalComments += 1
                            comments[index].star === 5
                                ? (fiveStar += 1)
                                : comments[index].star === 4
                                ? (fourStar += 1)
                                : comments[index].star === 3
                                ? (threeStar += 1)
                                : comments[index].star === 2
                                ? (twoStar += 1)
                                : comments[index].star === 1
                                ? (oneStar += 1)
                                : null
                            rating += comments[index].star
                        }
                    }
                    rating /= totalComments
                    const productObject = product.toObject()
                    productObject.rating = rating > 5 ? 5 : rating
                    productObject.numberOfComments = totalComments
                    productObject.fiveStar = fiveStar
                    productObject.fourStar = fourStar
                    productObject.threeStar = threeStar
                    productObject.twoStar = twoStar
                    productObject.oneStar = oneStar
                    productObject.sold = sold
                    data.push(productObject)
                }
                res.status(200).json(data)
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // get a product
    findById: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            let totalComments = []
            if (product) {
                let data = []
                let rating = 0
                let fiveStar = 0
                let fourStar = 0
                let threeStar = 0
                let twoStar = 0
                let oneStar = 0
                let sold = 0
                let totalCommentLength = 0
                const productDetails = product.productDetails
                for (const productDetail of productDetails) {
                    const billDetails = productDetail.billDetails
                    for (const billDetail of billDetails) {
                        const bill = await Bills.findById(billDetail.bill)
                        if (bill.type === 'X') {
                            sold += billDetail.quantity
                        }
                    }
                    const comments = productDetail.comments
                    for (const comment of comments) {
                        const commentItem = await Comments.findById(
                            comment._id,
                        ).populate('user')
                        if (commentItem.star > 0) {
                            totalCommentLength += 1
                            totalComments.push(commentItem)
                        }
                        comment.star === 5
                            ? (fiveStar += 1)
                            : comment.star === 4
                            ? (fourStar += 1)
                            : comment.star === 3
                            ? (threeStar += 1)
                            : comment.star === 2
                            ? (twoStar += 1)
                            : comment.star === 1
                            ? (oneStar += 1)
                            : null
                        rating += comment.star
                    }
                }
                rating /= totalCommentLength
                let productObject = product.toObject()
                productObject.rating = rating > 5 ? 5 : rating
                productObject.numberOfComments = totalCommentLength
                productObject.fiveStar = fiveStar
                productObject.fourStar = fourStar
                productObject.threeStar = threeStar
                productObject.twoStar = twoStar
                productObject.oneStar = oneStar
                productObject.sold = sold
                productObject.comments = totalComments
                data = productObject
                res.status(200).json(data)
            } else {
                res.status(404).json({
                    message: 'Product not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // search by name product
    searchByName: async (req, res) => {
        try {
            const name = req.query.name
            const check = RegExp(name, 'i')
            const products = await Products.find({ name: check })
                .populate('category')
                .populate('trademark')
                .exec()
            if (products) {
                res.status(200).json(products)
            } else {
                res.status(404).json({
                    message: 'Product name not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    // add product
    addProduct: async (req, res) => {
        try {
            const category = await Categories.findById(req.body.category)
            const trademark = await Trademarks.findById(req.body.trademark)

            const priceProduct = req.body.price
            if (
                priceProduct &&
                isNumber(priceProduct) &&
                priceProduct > 0 &&
                category &&
                trademark
            ) {
                const product = await Products.create(req.body)
                await category.updateOne({
                    $push: {
                        products: product.get('_id'),
                    },
                })
                await trademark.updateOne({
                    $push: {
                        products: product.get('_id'),
                    },
                })
                res.status(200).json({
                    message: 'Product add successful!',
                })
            } else {
                res.status(404).json({
                    message:
                        'Category/Trademark not found or price is not a number/price is 0',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Product add failed!',
            })
        }
    },

    // update product
    updateProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)
            if (product) {
                if (req.body.category) {
                    const oldCategory = await Categories.findById(
                        product.get('category'),
                    )
                    const category = await Categories.findById(
                        req.body.category,
                    )
                    if (category) {
                        await Products.findByIdAndUpdate(
                            req.params.id,
                            req.body,
                        )
                        await oldCategory.updateOne({
                            $pull: {
                                products: product.get('_id'),
                            },
                        })
                        await category.updateOne({
                            $push: {
                                products: product.get('_id'),
                            },
                        })
                        res.status(200).json({
                            message: 'Update product successful!',
                        })
                    } else {
                        res.status(404).json({
                            message: 'Category not found!',
                        })
                    }
                } else if (req.body.trademark) {
                    const oldTrademark = await Trademarks.findById(
                        product.get('trademark'),
                    )
                    const trademark = await Trademarks.findById(
                        req.body.trademark,
                    )
                    if (trademark) {
                        await Products.findByIdAndUpdate(
                            req.params.id,
                            req.body,
                        )
                        await oldTrademark.updateOne({
                            $pull: {
                                products: product.get('_id'),
                            },
                        })
                        await trademark.updateOne({
                            $push: {
                                products: product.get('_id'),
                            },
                        })
                        res.status(200).json({
                            message: 'Update product successful!',
                        })
                    } else {
                        res.status(404).json({
                            message: 'Trademark not found! ',
                        })
                    }
                } else {
                    await Products.findByIdAndUpdate(req.params.id, req.body)
                    res.status(200).json({
                        message: 'Update product successful!',
                    })
                }
            } else {
                res.status(404).json({
                    message: 'Product not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Product update failed!',
            })
        }
    },

    // delete products
    deleteProduct: async (req, res) => {
        try {
            let checkDelete = 0
            const product = await Products.findById(req.params.id)
            if (product) {
                const category = await Categories.findById(
                    product.get('category'),
                )
                await category.updateOne({
                    $pull: {
                        products: product.get('_id'),
                    },
                })

                const trademark = await Trademarks.findById(
                    product.get('trademark'),
                )
                await trademark.updateOne({
                    $pull: {
                        products: product.get('_id'),
                    },
                })

                const productDetails = await ProductDetails.find({
                    product: product.get('_id'),
                })

                for (let productDetail of productDetails) {
                    const size = await Sizes.findById(productDetail.get('size'))
                    const billDetails = productDetail.get('billDetails')
                    const comments = productDetail.get('comments')

                    if (billDetails.length === 0 && comments.length === 0) {
                        if (size) {
                            await size.updateOne({
                                $pull: {
                                    productDetails: productDetail.get('_id'),
                                },
                            })
                        }
                        await productDetail.remove()
                    } else {
                        checkDelete = 1
                    }
                }

                if (checkDelete === 0) {
                    await product.remove()
                    res.status(200).json({
                        message: 'Deleted the product successfully!',
                    })
                } else {
                    res.status(400).json({
                        message: 'You can not delete it!',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Product delete failed!',
            })
        }
    },
}

module.exports = productController
