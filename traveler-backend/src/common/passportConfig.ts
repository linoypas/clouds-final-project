import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/users';
import { IUser } from '../models/users';
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile); // Debugging the profile object to check its content

        // Check if the user already exists by their Google ID (not the email or _id)
        const existingUser = await userModel.findOne({ provider: "google" });

        if (existingUser) {
          // If the user exists, return the existing user
          return done(null, existingUser);
        }

        // If the user doesn't exist, create a new user with automatic ObjectId from MongoDB
        const newUser = await userModel.create({
          email: profile.emails[0].value,
          username: profile.displayName,  // Google's display name
          image: profile.photos[0]?.value || "",  // Profile picture URL from Google
          googleId: profile.id,  // Store Google ID
        });

        // Return the newly created user
        return done(null, newUser);
      } catch (err) {
        console.error("Error during Google OAuth:", err);
        return done(err, false);  // Handle errors
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  // Serialize using MongoDB's ObjectId (user._id)
  done(null, user._id.toString());
});

passport.deserializeUser(async (id: string, done) => {
  try {
    // Validate if the id passed is a valid MongoDB ObjectId string
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return done(new Error('Invalid ObjectId'), null);  // Handle invalid ObjectId
    }

    // Find the user by MongoDB _id (not googleId)
    const user = await userModel.findById(id);  
    if (!user) {
      return done(new Error('User not found'), null);  // Handle user not found
    }

    done(null, user);  // Pass the user object back to the session
  } catch (err) {
    done(err, null);  // Handle other errors
  }
});
