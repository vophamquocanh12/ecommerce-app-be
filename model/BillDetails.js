const mongoose = require("mongoose");

const billDetailsSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        default: 0,
    },
    productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',
        required: true,
    },
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bills',
        required: true,
        autopopulate: true
    },
},
    {
        timestamps: true
    }
)
billDetailsSchema.plugin(require('mongoose-autopopulate'))
billDetailsSchema.plugin(require('mongoose-paginate-v2'))

let BillDetails = mongoose.model('BillDetails', billDetailsSchema);
module.exports = BillDetails