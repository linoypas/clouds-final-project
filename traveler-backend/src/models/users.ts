import mongoose from "mongoose";

export interface IUser {
  email: string;
  password?: string; // Make password optional for Google login
  refreshToken?: string[];
  username: string;
  image?: string;
  _id: mongoose.Types.ObjectId;
  googleId?: string;  
}
export interface IUserModel extends IUser, Document {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Make password optional for Google login
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  image: { 
    type: String, 
    default: '/public/profile-pictures/default.png' 
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  googleId: {  // Store Google OAuth ID in this field
    type: String,
    unique: true,
  },

});

const userModel = mongoose.model<IUser>("Users", userSchema);

export default userModel;
