import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Función para generar un nombre de usuario único
const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

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
        let user = await User.findOne({
          $or: [{ email: profile.emails[0].value }, { googleId: profile.id }],
        });

        if (user) {
          // Si el usuario existe pero no tiene googleId, actualízalo
          if (!user.googleId) {
            user.googleId = profile.id;
            user.authType = "google";
            // Establece la contraseña como null para usuarios de OAuth
            user.password = null;
            await user.save();
          }
          return done(null, user);
        }

        // Generar un nombre de usuario único
        const baseUsername = profile.displayName
          ? profile.displayName.toLowerCase().replace(/\s+/g, "")
          : profile.emails[0].value.split("@")[0];

        const username = await generateUniqueUsername(baseUsername);

        // Crear nuevo usuario
        user = new User({
          username,
          email: profile.emails[0].value,
          googleId: profile.id,
          authType: "google",
        });

        await user.save();
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
