import jwt from 'jsonwebtoken';
import 'dotenv/config'
const jwtSecret = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign({ userId: user._id, email: user.email }, jwtSecret, {
    expiresIn: '1h', // Token expiration time
  });
};
