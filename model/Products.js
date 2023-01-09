const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const mongoose_auto_populate = require('mongoose-autopopulate');
mongoose.plugin(slug)

const productsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        slug: 'name'
    },
    origin: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
        autopopulate: true
    },
    trademark: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trademarks',
        required: true,
        autopopulate: true
    },
    productDetails: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductDetails'
        }],
        autopopulate: true
    },
},
    { timestamps: true }
)

productsSchema.plugin(mongoose_auto_populate);
productsSchema.plugin(require('mongoose-paginate-v2'));

let Products = mongoose.model("Products", productsSchema)
module.exports = Products 