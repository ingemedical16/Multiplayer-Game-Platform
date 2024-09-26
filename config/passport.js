import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User.js'; // Assuming you have a User model in your project
import 'dotenv/config';

// Define the JWT strategy configuration
const configurePassport = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
    secretOrKey: process.env.JWT_SECRET, // Secret key to verify the token
  };

  // Configure JWT strategy
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        // Find the user by the id encoded in the JWT payload
        const user = await User.findById(jwt_payload.id);
        if (user) {
          return done(null, user); // Attach the user object to the request
        }
        return done(null, false); // No user found
      } catch (error) {
        console.error(error);
        return done(error, false); // Handle error
      }
    })
  );
};

export { configurePassport };
