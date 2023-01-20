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
            
        } catch (error) {
            res.status(500).json({
                errorMessage: error
            })
        }
    },

    delete: async (req, res) => {
        try {
            
        } catch (error) {
            res.status(500).json({
                errorMessage: error
            })
        }
    },
}

module.exports = productDetailController
