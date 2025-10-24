import { verifyToken } from '../config/token.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.substring(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user; // attach full user doc
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default auth;
