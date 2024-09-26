// routes/oauthRoutes.js
import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile');
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook'));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/profile');
});

export default router;
