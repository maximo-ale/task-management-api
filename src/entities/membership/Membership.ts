import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const membershipSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    }
});

const membershipModel = model('Membership', membershipSchema);

export default membershipModel;