const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug)

const commentsSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        default: 0
    },
    images: {
        type:[String],
        default: []
    },

    productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductDetails',
        required: true,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments',
        default: null
    },
    children: {
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comments',
            }
        ],
        autopopulate: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
        autopopulate: true
    },
    actions: {
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Actions',
            }
        ]
    }
}, {
    timestamps: true
})
commentsSchema.plugin(require('mongoose-autopopulate'));
commentsSchema.plugin(require('mongoose-paginate-v2'))

let Comments = mongoose.model('Comments', commentsSchema)
module.exports = Comments