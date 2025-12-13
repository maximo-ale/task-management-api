import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['to-do', 'in-progress', 'done'],
        default: 'to-do',
    },
    tags: [String],
    list: {
        type: Schema.Types.ObjectId,
        ref: 'List',
        required: true,
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const taskModel = model('Task', taskSchema);

export default taskModel;