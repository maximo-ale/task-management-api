import mongoose from 'mongoose';

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
        required: true,
        ref: 'User',
    },
});

const boardModel = model('Board', boardSchema);

export default boardModel;