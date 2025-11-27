export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Optional for OAuth users
  googleId?: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthPayload {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthPayload;
}
