// routes/authRoutes.js
import { Router } from 'express';
import { fileURLToPath } from 'url';
import path,{ dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { signup, login, profile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

router.get('/signup', (req,res)=>{
    const filePath = path.join(__dirname, '..','pages', 'signup.html');
    res.sendFile(filePath);
});

router.get('/login', (req,res)=>{
    const filePath = path.join(__dirname, '..','pages', 'login.html');
    res.sendFile(filePath);
});
router.get('/profile', verifyToken, profile);


export default router;
