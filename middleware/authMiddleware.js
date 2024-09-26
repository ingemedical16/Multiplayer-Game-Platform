import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const jwtSecret = process.env.JWT_SECRET;
export const verifyTokenCookie = (req, res, next) => {
  const filePath = path.join(__dirname, '..','pages', 'login.html');
  const token = req.cookies.token;
  if (!token) return res.sendFile(filePath);

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.sendFile(filePath);
    req.user = decoded;
    next();
  });
};

export const redirectLoginPage  = (req, res, next) => {

  if(!req.user){
    const filePath = path.join(__dirname, '..','pages', 'login.html');
    
    return res.sendFile(filePath);
  }else {
    next()
  }
}

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, jwtSecret, (err, decoded) => {
   
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
    req.user = decoded;
   
    next();
  });
};
