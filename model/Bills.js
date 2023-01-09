const mongoose = require("mongoose");
const uuid = require('uuid');

const billsSchema = new mongoose.Schema({
    code: {
        type: String,
        default: () => uuid.v4().substring(0, 9)
    },
    shippedDate: {
        type: Date
    },
    status: {
        type: Number,
        default: 0
        // 0: đang xử lý
        // 1: đã xác nhận
        // 2: đang giao hàng
        // 3: giao thành công
    },
    statusDetails: {
        type: [Object],
    },
    payment: {
        type: String,
        required: true,
        default: 'cash'
    },
    type: {
        type: String,
        default: ''
    },
    feeShip: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    billDetails: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillDetails',
        }],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
},
    {
        timestamps: true
    }
)

billsSchema.plugin(require('mongoose-autopopulate'))
billsSchema.plugin(require('mongoose-paginate-v2'))

let Bills = mongoose.model('Bills', billsSchema);
module.exports = Bills