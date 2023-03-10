const mongoose = require('mongoose')

const ImageSchema = new mongoose.Schema({
    imageMain: {
        type: String,
        required: true
    },
    imagesSub: [{
        type: String,
        default: ''
    }],
    productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',
        autopopulate: true,
    }
},
    {
        timestamps: true
    })

let Images =  mongoose.model('Images', ImageSchema)
module.exports = Images