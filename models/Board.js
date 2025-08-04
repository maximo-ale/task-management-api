const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const boardSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

module.exports = model('Board', boardSchema);