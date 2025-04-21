import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //the user who is following someone
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, //the user is being followed
    createdAt: { type: Date, default: Date.now }
});

FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", FollowSchema);
export default Follow;
