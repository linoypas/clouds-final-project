import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/users';  // Sequelize User model import

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile); // Debug the profile

        // Find user by Google ID
        const existingUser = await User.findOne({ where: { googleId: profile.id } });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Create new user
        const newUser = await User.create({
          email: profile.emails?.[0]?.value || '',
          username: profile.displayName || '',
          profilePicture: profile.photos?.[0]?.value || '',
          googleId: profile.id,
        });

        return done(null, newUser);
      } catch (err) {
        console.error("Error during Google OAuth:", err);
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  // Serialize using user.id (primary key in Sequelize)
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(new Error('User not found'), null);
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
