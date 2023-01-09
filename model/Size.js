const mongoose = require("mongoose");


const sizesSchema = new mongoose.Schema({
    size: {
        type: String,
        required: true,
        unique: true
    },
    productDetails: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductDetails',
        }]
    }
},
    {
        timestamps: true
    }
)

let Sizes = mongoose.model('Sizes', sizesSchema);
module.exports = Sizes