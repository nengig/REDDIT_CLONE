import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'  // Allows dynamic reference (e.g., Post or Comment)
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Posts', 'Comment'] // Allows voting on either posts or comments
  },
  direction: {
    type: Number,
    enum: [1, -1],
    required: true
  }
});

VoteSchema.index({ userId: 1, parentId: 1 });

const Vote = mongoose.model('Vote', VoteSchema);
export default Vote;
