import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface IPost {
    title: string;
    content: string;
    owner: mongoose.Schema.Types.ObjectId;
    likes: string[];
    image?: string;
}

const post = new Schema<IPost>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },  likes: { type: [String], default: [] },
  image: { type: String },  
});

const Posts = mongoose.model<IPost>("posts",post);
export default Posts;