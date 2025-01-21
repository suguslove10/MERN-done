import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const vendor = await Vendor.findOne({ _id: decoded.id });

    if (!vendor) {
      throw new Error();
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export default auth;