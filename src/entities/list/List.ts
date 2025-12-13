import mongoose from 'mongoose';

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
});

const listModel = model('List', listSchema);

export default listModel;