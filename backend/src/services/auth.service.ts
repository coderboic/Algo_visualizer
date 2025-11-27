import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, AuthPayload, TokenResponse } from '../models/User';
import { UserModel } from '../models/User.schema';

// In-memory database for fallback
const memoryUsers: Map<string, User> = new Map();
const memoryRefreshTokens: Set<string> = new Set();

// Initialize demo user
const initializeDemoUser = async (useMongoDB: boolean) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    if (useMongoDB) {
      const existingUser = await UserModel.findOne({ email: 'demo@example.com' });
      if (!existingUser) {
        await UserModel.create({
          username: 'demo',
          email: 'demo@example.com',
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'User',
        });
        console.log('👤 Demo user created (MongoDB)');
      }
    } else {
      // In-memory fallback
      const demoUserId = uuidv4();
      memoryUsers.set(demoUserId, {
        id: demoUserId,
        username: 'demo',
        email: 'demo@example.com',
        password: hashedPassword,
        firstName: 'Demo',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log('👤 Demo user created (In-Memory)');
    }
  } catch (error) {
    console.error('Error initializing demo user:', error);
  }
};

export class AuthService {
  private jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  private refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-key-change-in-production';
  private tokenExpiry = '15m';
  private refreshTokenExpiry = '7d';
  private useMongoDB = false;

  constructor() {
    // Initialization happens via setUseMongoDB
  }

  setUseMongoDB(value: boolean) {
    this.useMongoDB = value;
    console.log(`🗄️  AuthService storage mode: ${value ? 'MongoDB' : 'In-Memory'}`);
    initializeDemoUser(value).catch(console.error);
  }

  /**
   * Register a new user
   */
  async register(username: string, email: string, password: string): Promise<TokenResponse> {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (this.useMongoDB) {
      // MongoDB Implementation
      const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const newUser = await UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      return this.generateTokens(newUser);
    } else {
      // In-Memory Implementation
      const existingUser = Array.from(memoryUsers.values()).find(
        u => u.username === username || u.email === email
      );

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const userId = uuidv4();
      const newUser: User = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      memoryUsers.set(userId, newUser);
      return this.generateTokens(newUser);
    }
  }

  /**
   * Login user with username and password
   */
  async login(username: string, password: string): Promise<TokenResponse> {
    let user: any;

    if (this.useMongoDB) {
      user = await UserModel.findOne({ username });
    } else {
      user = Array.from(memoryUsers.values()).find(u => u.username === username);
    }

    if (!user || !user.password) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  /**
   * Google OAuth login/register
   */
  async googleAuth(googleId: string, email: string, firstName: string, lastName: string, profilePicture?: string): Promise<TokenResponse> {
    if (this.useMongoDB) {
      // MongoDB Implementation
      let user = await UserModel.findOne({ googleId });

      if (!user) {
        const existingEmailUser = await UserModel.findOne({ email });

        if (existingEmailUser) {
          existingEmailUser.googleId = googleId;
          if (profilePicture && !existingEmailUser.profilePicture) existingEmailUser.profilePicture = profilePicture;
          if (firstName && !existingEmailUser.firstName) existingEmailUser.firstName = firstName;
          if (lastName && !existingEmailUser.lastName) existingEmailUser.lastName = lastName;
          user = await existingEmailUser.save();
        } else {
          const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);
          user = await UserModel.create({
            username,
            email,
            googleId,
            firstName,
            lastName,
            profilePicture,
          });
        }
      }
      return this.generateTokens(user);
    } else {
      // In-Memory Implementation
      let user = Array.from(memoryUsers.values()).find(u => u.googleId === googleId);

      if (!user) {
        const userId = uuidv4();
        const username = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5);

        user = {
          id: userId,
          username,
          email,
          googleId,
          firstName,
          lastName,
          profilePicture,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        memoryUsers.set(userId, user);
      }
      return this.generateTokens(user);
    }
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(user: any): TokenResponse {
    const userId = this.useMongoDB ? user._id.toString() : user.id;

    const payload: AuthPayload = {
      id: userId,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: this.tokenExpiry } as any);
    const refreshToken = jwt.sign(payload, this.refreshTokenSecret, { expiresIn: this.refreshTokenExpiry } as any);

    if (!this.useMongoDB) {
      memoryRefreshTokens.add(refreshToken);
    }

    return {
      accessToken,
      refreshToken,
      user: payload,
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): AuthPayload {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as AuthPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh access token
   */
  refreshAccessToken(refreshToken: string): TokenResponse {
    if (!this.useMongoDB && !memoryRefreshTokens.has(refreshToken)) {
      throw new Error('Invalid refresh token');
    }

    try {
      const decoded = jwt.verify(refreshToken, this.refreshTokenSecret) as AuthPayload;

      // Generate new access token
      const options = { expiresIn: this.tokenExpiry };
      const accessToken = (jwt.sign as any)(
        {
          id: decoded.id,
          username: decoded.username,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          profilePicture: decoded.profilePicture
        },
        this.jwtSecret,
        options
      );

      return {
        accessToken,
        refreshToken,
        user: decoded,
      };
    } catch (error) {
      if (!this.useMongoDB) {
        memoryRefreshTokens.delete(refreshToken);
      }
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  logout(refreshToken: string): void {
    if (!this.useMongoDB) {
      memoryRefreshTokens.delete(refreshToken);
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    if (this.useMongoDB) {
      const user = await UserModel.findById(userId);
      if (!user) return null;

      return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } else {
      const user = memoryUsers.get(userId);
      return user || null;
    }
  }

  /**
   * Verify Google OAuth token and login/register user
   */
  async verifyGoogleToken(credential: string): Promise<TokenResponse> {
    try {
      // Decode the JWT token from Google (without verification for now)
      // In production, you should verify this with Google's API
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        Buffer.from(base64, 'base64')
          .toString()
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const payload = JSON.parse(jsonPayload);
      const { email, name, sub: googleId, picture } = payload;

      if (!email) {
        throw new Error('Email not provided by Google');
      }

      // Check if user exists
      let user;

      if (this.useMongoDB) {
        user = await UserModel.findOne({ email });

        if (!user) {
          // Create new user with Google data
          user = await UserModel.create({
            username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
            email,
            password: await bcrypt.hash(Math.random().toString(36), 10), // Random password
            firstName: name?.split(' ')[0] || '',
            lastName: name?.split(' ').slice(1).join(' ') || '',
            profilePicture: picture,
            googleId,
          });
        }

        return this.generateTokens(user);
      } else {
        // In-memory implementation
        user = Array.from(memoryUsers.values()).find(u => u.email === email);

        if (!user) {
          const userId = uuidv4();
          user = {
            id: userId,
            username: email.split('@')[0] + '_' + Math.random().toString(36).substring(7),
            email,
            password: await bcrypt.hash(Math.random().toString(36), 10),
            firstName: name?.split(' ')[0] || '',
            lastName: name?.split(' ').slice(1).join(' ') || '',
            profilePicture: picture,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          memoryUsers.set(userId, user);
        }

        return this.generateTokens(user);
      }
    } catch (error: any) {
      console.error('Google token verification error:', error);
      throw new Error('Invalid Google token');
    }
  }
}

export const authService = new AuthService();
