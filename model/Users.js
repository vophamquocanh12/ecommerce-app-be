const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator');
const mongoose_auto_populate = require('mongoose-autopopulate');
const uuid = require('uuid');
mongoose.plugin(slug)

const userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        default: '',
        required: true
    },
    phone: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ''
    },
    numberBankAccount: {
        type: String,
        default: '',
        unique: true
    },
    isAdmin: {
        type: Number,
        default: 0
    },
    isCustomer: {
        type: Number,
        default: 0,
    },
    isProvider: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0,
    },
    bills: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Bills',
        }]
    },
    comments: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comments',
        }]
    },
    actions: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Actions',
            }
        ]
    },
},
    {
        timestamps: true
    }
)

userSchema.plugin(mongoose_auto_populate);
userSchema.plugin(require('mongoose-paginate-v2'));

let Users = mongoose.model("Users", userSchema)
module.exports = Users 