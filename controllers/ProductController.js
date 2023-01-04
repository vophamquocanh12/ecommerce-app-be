const { Categories, Trademarks, Products, BillDetails } = require('../model/model')

const productController = {

    // get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Products.find().populate('category').populate('trademark')
            res.status(200).json(products)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // get a product
    getAProduct: async (req, res) => { },

    // search by name product
    searchByName: async (req, res) => { },

    // add product
    addProduct: async (req, res) => {
        try {
            const category = await Categories.findById(req.body.category)
            const trademark = await Trademarks.findById(req.body.trademark)

            const priceProduct = req.body.price
            if (priceProduct && isNumber(priceProduct) && priceProduct > 0 && category && trademark) {
                const product = await Products(req.body)
                await category.updateOne({
                    $push: {
                        products: product.get('_id')
                    }
                })
                await trademark.updateOne({
                    $push: {
                        products: product.get('_id')
                    }
                })
                res.status(200).json(product)
            } else {
                res.status(404).json({
                    errorMessage: 'Category/Trademark not found or price is not a number/price is 0'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Product add failed!'
            })
        }
    },

    // update product 
    updateProduct: async (req, res) => {
        try {
            const product = await Products.findById(req.params.id)

            const category = await Products(req.body.category)
            const trademark = await Products(req.body.trademark)
            if (product) {
                if (category) {
                    const oldCategory = await Categories.findById(product.get('category'))
                    const newCategory = await Categories.findById(category)
                    if (newCategory) {
                        const result = await Products.findByIdAndUpdate(
                            req.params.id,
                            req.body
                        )
                        await oldCategory.updateOne({
                            $pull: {
                                products: product.get('_id')
                            }
                        })
                        await newCategory.updateOne({
                            $push: {
                                products: product.get('_id')
                            }
                        })
                        res.status(200).json({
                            message: 'Product update successful!'
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            errorMessage: "Category not found",
                        });
                    }
                } else if (trademark) {
                    const oldTrademark = await Trademarks.findById(product.get('trademark'))
                    const newTrademark = await Trademarks.findById(trademark)
                    if (newTrademark) {
                        const result = await Products.findByIdAndUpdate(
                            req.params.id,
                            req.body
                        )
                        await oldTrademark.updateOne({
                            $pull: {
                                products: product.get("_id"),
                            }
                        })
                        await newTrademark.updateOne({
                            $push: {
                                products: product.get("_id"),
                            },
                        })
                        res.status(200).json({
                            message: 'Product update successful!'
                        })
                    } else {
                        res.status(404).json({
                            status: 404,
                            errorMessage: "Trademark not found",
                        });
                    }
                } else {
                    const result = await Products.findByIdAndUpdate(
                        req.params.id,
                        req.body
                    );
                    res.status(500).json({
                        message: 'Product update failed!'
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                message: 'Product update failed!'
            })
        }
    },

    // delete products 
    deleteProduct: async (req, res) => { 
        try {
            let checkDelete = 0
            const product = await Products.findById(req.params.id);
            if(product){
                const category = await Categories.findById(product.get('category'))
                
            }
        } catch (error) {
            res.status(500).json({
                message: 'Product delete failed!'
            }) 
        }
    }
}

module.exports = productController