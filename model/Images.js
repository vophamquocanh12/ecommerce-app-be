const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    imageMain: {
        type: String,
        required: true
    },
    imageSub: [{
        type: String,
        default: ''
    }],
    productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',

    }
},
    {
        timestamps: true
    })

let Images =  mongoose.model('Images', ImageSchema)
module.exports = Images