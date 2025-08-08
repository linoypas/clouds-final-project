import mongoose from "mongoose";

export interface IComment {
  content: string;
  owner: mongoose.Schema.Types.ObjectId;
  postId: string;
}

const commentSchema = new mongoose.Schema<IComment>({
  content: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});

const commentsModel = mongoose.model<IComment>("Comments", commentSchema);

export default commentsModel;