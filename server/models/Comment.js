import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Posts',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null // Null for top-level comments
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
});

const Comment = model('Comment', commentSchema);
export default Comment;



