import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../config/token.js';

const sanitizeUser = (user) => ({ id: user.id, name: user.name, email: user.email, avatar: user.avatar });

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    const token = signToken({ id: user.id });
    return res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken({ id: user.id });
    return res.json({ user: sanitizeUser(user), token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user; // set by auth middleware
    return res.json({ user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
