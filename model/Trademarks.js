const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const mongoose_auto_populate = require('mongoose-autopopulate');
mongoose.plugin(slug)

const trademarksSchema = new mongoose.Schema({
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

trademarksSchema.plugin(mongoose_auto_populate);
trademarksSchema.plugin(require('mongoose-paginate-v2'));

let Trademarks = mongoose.model("Trademarks", trademarksSchema)
module.exports = Trademarks