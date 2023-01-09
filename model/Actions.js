const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        autopopulate: true
    },

    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comments',
        autopopulate: true
    }
},
    {
    timestamps: true
}
);

ActionsSchema.plugin(require('mongoose-autopopulate'))
ActionsSchema.plugin(require('mongoose-paginate-v2'))

let Actions = mongoose.model('Actions', ActionsSchema);
module .exports = Actions