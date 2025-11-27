import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/google', authController.googleCallback.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/logout', authController.logout.bind(authController));

// Protected routes
router.get('/me', verifyToken, authController.getCurrentUser.bind(authController));
router.get('/verify', verifyToken, authController.verifyAuthToken.bind(authController));

export default router;
