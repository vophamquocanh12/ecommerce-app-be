const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.plugin(slug)

const categoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        slug: 'name',
        unique: true
    },
    products: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
        }]
    }
},
    {
        timestamps: true
    }
)
categoriesSchema.plugin(require('mongoose-autopopulate'))
categoriesSchema.plugin(mongoosePaginate)
let Categories = mongoose.model("Categories", categoriesSchema)
module.exports = Categories 