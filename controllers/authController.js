import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// JWT Secret
const jwtSecret = process.env.JWT_SECRET;  //

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'User creation failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateToken(user);
  res.json({ token, userId: user._id });
};

export const profile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};
