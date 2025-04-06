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
    enum: ['Post', 'Comment'] // Allows voting on either posts or comments
  },
  direction: {
    type: Number,
    enum: [1, -1],
    required: true
  }
});

const Vote = mongoose.model('Vote', VoteSchema);
export default Vote;
