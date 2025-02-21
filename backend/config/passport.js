import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.OAUTH_CALLBACK_URL ||
        "http://localhost:4000/api/auth/google/callback",
      passReqToCallback: true,
      proxy: true,
      scope: ["profile", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Si el usuario existe pero no tiene googleId, actualízalo
          if (!user.googleId) {
            user.googleId = profile.id;
            // Establece la contraseña como null para usuarios de OAuth
            user.password = null;
            await user.save();
          }
          return done(null, user);
        }

        // Crear nuevo usuario
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });

        await user.save({ validateBeforeSave: false });
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
