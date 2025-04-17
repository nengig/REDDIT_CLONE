import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        username: {
            type: String,
            require: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        password: {
            type: String,
            require: true,

        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    }
)
// Tell Mongoose to include virtuals in `toObject()` / `toJSON()`
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

// Virtual for posts
userSchema.virtual('posts', {
    ref: 'Posts',                // model name from Post.js :contentReference[oaicite:0]{index=0}&#8203;:contentReference[oaicite:1]{index=1}
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});

// Virtual for comments
userSchema.virtual('comments', {
    ref: 'Comment',              // model name from Comment.js :contentReference[oaicite:2]{index=2}&#8203;:contentReference[oaicite:3]{index=3}
    localField: '_id',
    foreignField: 'userId',
    justOne: false,
});


const User = mongoose.model("User", userSchema)

export default User