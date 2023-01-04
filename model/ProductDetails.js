const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const uuid = require('uuid');
const mongoose_auto_populate = require('mongoose-autopopulate');
mongoose.plugin(slug)

const productDetailsSchema = new mongoose.Schema({
    sku: {
        type: String,
        default: () => uuid.v4().substring(0, 9)

        // uuid: auto-generated 9 characters
    },
    quantity: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0,

        // 0: hết hàng
        // 1: còn hàng
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sizes',
        autopopulate: true
    },
    quantitiesOfNorm: {
        type: Number,
        default: 0
    },
    billDetails: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillDetails',
        }],
        autopopulate: true
    }

},
    { timestamps: true }
)

productDetailsSchema.plugin(mongoose_auto_populate);
productDetailsSchema.plugin(require('mongoose-paginate-v2'));
let ProductDetails = mongoose.model("ProductDetails", productDetailsSchema)
module.exports = ProductDetails 