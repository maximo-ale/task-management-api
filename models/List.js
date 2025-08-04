const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    position: {
        type: Number,
        default: 0,
    }
});

module.exports = model('List', listSchema);