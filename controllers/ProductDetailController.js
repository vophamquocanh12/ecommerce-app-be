const {
    ProductDetails,
    Products,
    BillDetails,
    Sizes,
    Images
} = require('../model/model')

const productDetailController = {

    create: async (req, res) => {
        try {
            let i = 0
            let checkExist = 0
            let checkError = 0

            for(let element in req.body){
                i = element + 1
                let {product, sizes, images} = req.body[element]
                if(product && sizes){
                    const product_id = await Products.findById(product)
                    if(product_id){
                        const imageCheck = images[0].toLowerCase()
                        const imageSub = images.slice(1)
                        for(const size of sizes){
                            const checkSize = await Sizes.findOne({
                                size: size.toLowerCase()
                            })
                            if(!checkSize){
                                await Sizes.create({
                                    size: size.toLowerCase()
                                })
                            }
                        }

                        const newImage = await Images.create({
                            imageMain: imageCheck
                        })

                        for(const index in imageSub){
                            await newImage.updateOne({
                                $push: {
                                    imageSub: imageSub[index]
                                }
                            })
                        }

                        for(const size of sizes){
                            const checkSize = await Sizes.findOne({
                                size: size.toLowerCase()
                            })
                            const productDetail = await ProductDetails.findOne({
                                product: product_id._id,
                                size: checkSize._id

                            }) 

                            if(productDetail){

                            }else{
                                const productDetail = await ProductDetails.create({
                                    product: product_id.get('_id'),
                                    size: checkSize.get('_id'),
                                    images: newImage.get('_id')
                                })
                                await newImage.updateOne({
                                    productDetail: productDetail.get('_id')
                                })
                                await Sizes.updateOne({
                                    _id: checkSize.get('_id')
                                },{
                                    $push:{
                                        productDetails: productDetail.get('_id')
                                    }
                                })
                            }
                        }
                    }else{
                        res.status(404).json({
                            message: 'Product at locate' + (element + 1) + ' not found!'
                        })
                        checkError = 1
                        break
                    }
                }else{
                    res.status(404).json({
                        errorMessage: 'Missing data at ' + (element + 1) + ' row'
                    })
                    checkError = 1
                    break
                }
            }
            if(checkExist && !checkError){
                res.status(200).json({
                    message: 'Product detail at located ' + checkExist + 'is exist. Otherwise create new product detail!'
                })
            } else if (!checkExist && !checkError) {
                res.status(201).json({
                    message: 'Product detail create success!'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error
            })
        }
    },

    update: async (req, res) => {
        try {
            let check = 0
            const product = await Products.findById(req.params.id)
            if(product){
                const productDetails = await ProductDetails.find({
                    product: req.params.id
                })
                if(productDetails.length > 0){
                    for(const index in productDetails){
                        if(productDetails[index].billDetails.length === 0 && productDetails[index].comments.length === 0){
                            await Sizes.findByIdAndUpdate(productDetails[index].size, {
                                $pull: {
                                    productDetails: productDetails[index]._id
                                }
                            })

                            if(productDetails[index].get('images')[0].get('_id')){
                                await ProductDetails.findByIdAndUpdate(productDetails[index]._id, {
                                    $pull: {
                                        images: productDetails[index].images[0].get('_id')
                                    }
                                })

                                await Images.findByIdAndDelete(productDetails[index].get('images')[0].get('_id'))
                            }

                            await product.updateOne({
                                $pull: {
                                    productDetails: productDetails[index]._id
                                }
                            })

                            await productDetails[index].remove()
                        }
                    }

                    for(let element in req.body){
                        let { product, sizes, images} = req.body[element]
                        if(product && sizes){
                            const product_id = await Products.findById(product)
                            if(product_id){
                                const imagesSub = images.slice(1)
                                const newImage = await Image.create({
                                    image: images[0],
                                })

                                for (const index in imagesSub) {
                                    await newImage.updateOne({
                                        $push: {
                                            imagesSub: imagesSub[index]
                                        }
                                    })
                                }
                                
                                for(const size of sizes){
                                    const size_id = await Sizes.findOne({
                                        size: size.toLowerCase()
                                    })
                                    const productDetail = await ProductDetails.findOne({
                                        product: product_id._id,
                                        size: size_id._id,
                                    })
                                    if (productDetail) {
                                    } else {
                                        const productDetail = await ProductDetails.create({
                                            product: product_id.get('_id'),
                                            size: size_id.get('_id'),
                                            images: newImage.get('_id')
                                        })
                                        await newImage.updateOne({
                                            'productDetail': productDetail.get('_id'),
                                        })
                                        await Products.updateOne({
                                            _id: product_id.get('_id')
                                        }, {
                                            $push: {
                                                productDetails: productDetail.get('_id')
                                            }
                                        })
                                        await Sizes.updateOne({
                                            _id: size_id.get('_id')
                                        }, {
                                            $push: {
                                                productDetails: productDetail.get('_id')
                                            }
                                        })
                                        await Colors.updateOne({
                                            _id: color_id_.get('_id')
                                        }, {
                                            $push: {
                                                productDetails: productDetail.get('_id')
                                            }
                                        })
                                    }
                                }
                            } else {
                                check = 1
                                res.status(404).json({
                                    errorMessage: 'Product at locate' + (element + 1) + ' not found'
                                })
                                break
                            }
                        } else {
                            check = 1
                            res.status(404).json({
                                errorMessage: 'Missing data at ' + (element + 1) + ' row'
                            })
                            break
                            return
                        }
                    }
                }
                if (check === 0) {
                    res.status(200).json({
                        successMessage: 'Import success!'
                    })
                } else {
                    res.status(404).json({
                        errorMessage: 'Import fail!'
                    })
                }
            } else {
                res.status(404).json({
                    errorMessage: 'Product not found!'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error
            })
        }
    },

    delete: async (req, res) => {
        try {
            const productDetail = await ProductDetails.findById(req.params.id)
            if (productDetail) {
                const product = await Products.findById(productDetail.get('product'))
                const size = await Sizes.findById(productDetail.get('size'))
                await product.updateOne({
                    $pull: {
                        productDetails: productDetail.get('_id')
                    }
                })
                
                await size.updateOne({
                    $pull: {
                        productDetails: productDetail.get('_id')
                    }
                })

                await productDetail.remove()
                res.status(200).json({
                    message: 'Delete success!'
                })
            } else
                res.status(404).json({
                    errorMessage: 'Product detail not found!'
                })
        } catch (error) {
            res.status(500).json({
                errorMessage: error
            })
        }
    },
}

module.exports = productDetailController
