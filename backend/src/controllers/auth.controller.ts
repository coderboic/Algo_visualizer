import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  /**
   * Register new user
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' });
        return;
      }

      const result = await authService.register(username, email, password);

      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response, _next: NextFunction) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = await authService.login(username, password);

      res.json({
        status: 'success',
        message: 'Logged in successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Google OAuth callback - Handles Google Sign-In
   */
  async googleCallback(req: Request, res: Response, _next: NextFunction) {
    try {
      const { credential } = req.body;

      if (!credential) {
        res.status(400).json({ error: 'Google credential is required' });
        return;
      }

      // Verify and decode the Google JWT token
      const result = await authService.verifyGoogleToken(credential);

      res.json({
        status: 'success',
        message: 'Google authentication successful',
        token: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (error: any) {
      console.error('Google OAuth error:', error);
      res.status(401).json({ error: error.message || 'Google authentication failed' });
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response, _next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Refresh token is required' });
        return;
      }

      const result = authService.refreshAccessToken(refreshToken);

      res.json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Logout user
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        authService.logout(refreshToken);
      }

      res.json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await authService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({
        status: 'success',
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Verify token (for checking if user is authenticated)
   */
  async verifyAuthToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      res.json({
        status: 'success',
        authenticated: true,
        user: req.user,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export const authController = new AuthController();
