# Algorithm Visualizer - Deployment Guide

## 📋 Overview

This guide will help you deploy your Algorithm Visualizer application with:
- **Frontend**: React + Vite → Deployed on **Vercel** (recommended) or **Netlify**
- **Backend**: Node.js + Express → Deployed on **Render** (recommended) or **Railway**
- **Database**: MongoDB Atlas (cloud database)

## 🎯 Deployment Strategy

### Architecture:
```
Frontend (Vercel)  →  Backend API (Render)  →  MongoDB Atlas
     ↓
Google OAuth
```

---

## 📦 Pre-Deployment Checklist

### 1. Prepare MongoDB Database

**Using MongoDB Atlas (Free Tier):**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a New Cluster:
   - Choose **FREE** M0 Sandbox tier
   - Select a cloud provider and region (closest to your users)
   - Cluster Name: `algo-visualizer`
4. Create Database User:
   - Go to **Database Access**
   - Click **Add New Database User**
   - Username: `admin` (or your choice)
   - Password: Generate a strong password (save it!)
   - User Privileges: Read and write to any database
5. Whitelist IP Addresses:
   - Go to **Network Access**
   - Click **Add IP Address**
   - Click **Allow Access from Anywhere** (for now)
   - IP: `0.0.0.0/0` (confirms access from any IP)
6. Get Connection String:
   - Go to **Database** → **Connect**
   - Choose **Connect your application**
   - Copy the connection string:
   ```
   mongodb+srv://admin:<password>@algo-visualizer.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password

### 2. Configure Google OAuth for Production

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth Client ID
3. Add **Production URLs** to Authorized JavaScript origins:
   - Your backend URL (e.g., `https://algo-visualizer-api.onrender.com`)
   - Your frontend URL (e.g., `https://algo-visualizer.vercel.app`)
4. Add **Production URLs** to Authorized redirect URIs:
   - `https://algo-visualizer.vercel.app`
   - `https://algo-visualizer-api.onrender.com/api/auth/google/callback`
5. Save changes

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Backend for Production

#### 1.1 Update Backend Environment Variables

Create `backend/.env.production` (for your reference):
```env
# Production Environment Variables (DO NOT COMMIT)

# Server
NODE_ENV=production
PORT=5000

# JWT Secrets (GENERATE NEW ONES!)
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production_12345
REFRESH_TOKEN_SECRET=your_super_secure_refresh_secret_change_this_in_production_67890

# MongoDB Connection (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@algo-visualizer.xxxxx.mongodb.net/algo_visualizer?retryWrites=true&w=majority

# Google OAuth
GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_FROM_GOOGLE_CLOUD

# Google Gemini API (for AI code fixing)
GEMINI_API_KEY=AIzaSyD_R77cz7PiGscHWb5AU2MeYMykQNxx4l0

# CORS - Your frontend URL
FRONTEND_URL=https://algo-visualizer.vercel.app
```

**🔐 Generate Secure JWT Secrets:**
```bash
# Run these commands to generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 1.2 Update CORS Configuration

Update `backend/src/index.ts` to use environment variable for CORS:
```typescript
// Add at the top after imports
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Update CORS configuration
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
}));
```

#### 1.3 Add Start Script (Already Done ✅)

Your `package.json` already has:
```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js"
}
```

### Step 2: Deploy to Render

1. **Create Render Account**:
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Connect GitHub Repository**:
   - Push your code to GitHub if not already done:
     ```bash
     git add .
     git commit -m "Prepare for deployment"
     git push origin main
     ```

3. **Create New Web Service**:
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select `Algo_visualizer` repository

4. **Configure Service**:
   - **Name**: `algo-visualizer-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. **Add Environment Variables**:
   Click **Advanced** → **Add Environment Variable**

   Add these one by one:
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<your_generated_secret>
   REFRESH_TOKEN_SECRET=<your_generated_secret>
   MONGODB_URI=<your_mongodb_atlas_connection_string>
   GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=<from_google_cloud_console>
   GEMINI_API_KEY=AIzaSyD_R77cz7PiGscHWb5AU2MeYMykQNxx4l0
   FRONTEND_URL=https://algo-visualizer.vercel.app
   ```

6. **Deploy**:
   - Click **Create Web Service**
   - Wait for build and deployment (5-10 minutes)
   - Your backend will be live at: `https://algo-visualizer-api.onrender.com`

7. **Test Backend**:
   Visit: `https://algo-visualizer-api.onrender.com/api/health`
   Should return: `{ "status": "ok", "message": "API is running" }`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

#### 1.1 Update Environment Variables

Create `frontend/.env.production`:
```env
# Production Environment Variables

# Backend API URL (your Render backend URL)
VITE_API_URL=https://algo-visualizer-api.onrender.com/api

# Google OAuth Client ID (same as development)
VITE_GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
```

#### 1.2 Update Build Configuration (Already Done ✅)

Your `package.json` already has:
```json
"scripts": {
  "build": "tsc -b && vite build"
}
```

#### 1.3 Create Vercel Configuration

Create `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures React Router works correctly on Vercel.

### Step 2: Deploy to Vercel

1. **Create Vercel Account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**:
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Select `Algo_visualizer`

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   Go to **Settings** → **Environment Variables**

   Add these:
   ```
   VITE_API_URL=https://algo-visualizer-api.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
   ```

5. **Deploy**:
   - Click **Deploy**
   - Wait for build (2-5 minutes)
   - Your frontend will be live at: `https://algo-visualizer.vercel.app`

6. **Custom Domain (Optional)**:
   - Go to **Settings** → **Domains**
   - Add your custom domain if you have one

---

## 🔧 Post-Deployment Configuration

### 1. Update Google OAuth

Go back to [Google Cloud Console](https://console.cloud.google.com/apis/credentials):

1. Edit your OAuth Client ID
2. Add to **Authorized JavaScript origins**:
   - `https://algo-visualizer.vercel.app`
   - `https://algo-visualizer-api.onrender.com`
3. Add to **Authorized redirect URIs**:
   - `https://algo-visualizer.vercel.app`
   - `https://algo-visualizer-api.onrender.com/api/auth/google/callback`
4. Save

### 2. Update Backend CORS

If you get CORS errors, update `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://algo-visualizer.vercel.app', // Add your Vercel URL
  ],
  credentials: true,
}));
```

Then redeploy backend.

### 3. Test All Features

✅ **Authentication**:
- Regular email/password signup and login
- Google OAuth login

✅ **Algorithm Visualization**:
- Sorting algorithms with step-by-step visualization
- Searching algorithms
- Graph algorithms
- Dynamic programming

✅ **Code Playground**:
- Code execution in multiple languages
- AI-powered code fixing with Gemini

✅ **WebSocket Features**:
- Real-time visualization updates

---

## 🐛 Troubleshooting

### Backend Issues

**Build Fails on Render**:
- Check build logs
- Ensure `tsconfig.json` is in backend folder
- Verify all dependencies are in `package.json`

**MongoDB Connection Fails**:
- Check connection string format
- Ensure password doesn't have special characters (or URL encode them)
- Verify Network Access whitelist in MongoDB Atlas

**Environment Variables Not Working**:
- Redeploy after adding new variables
- Check variable names (case-sensitive)
- Restart the service

### Frontend Issues

**API Calls Fail**:
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure backend is running and accessible

**Google OAuth Not Working**:
- Verify authorized origins are added in Google Console
- Check client ID is correct in environment variables
- Clear browser cache and cookies

**Build Fails on Vercel**:
- Check build logs
- Ensure all dependencies are listed in `package.json`
- Verify TypeScript compilation succeeds locally

### Common Errors

**"Failed to fetch" or CORS Errors**:
```typescript
// backend/src/index.ts - Update CORS
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://your-vercel-url.vercel.app'],
  credentials: true,
}));
```

**Google OAuth "Unauthorized"**:
- Add production URLs to Google Cloud Console
- Wait 5-10 minutes for changes to propagate

**MongoDB "Authentication Failed"**:
- Check username and password in connection string
- Ensure user has correct permissions in MongoDB Atlas

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Starting):

- **MongoDB Atlas**: Free (M0 Sandbox - 512MB storage)
- **Render**: Free (750 hours/month, goes to sleep after inactivity)
- **Vercel**: Free (100GB bandwidth, unlimited projects)
- **Google Cloud**: Free (OAuth is free, Gemini API has free tier)

**Total: FREE** 🎉

### Limitations of Free Tier:

- Render: Backend sleeps after 15 minutes of inactivity (30-60s wake up time)
- MongoDB: 512MB storage limit
- Vercel: 100GB bandwidth/month

### Paid Tiers (If Needed):

- **Render**: $7/month (always on, no sleep)
- **MongoDB Atlas**: $0.08/hour for M10 tier
- **Vercel**: Pro plan $20/month (400GB bandwidth)

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-Deploy**:
   - Vercel: Automatically builds and deploys frontend
   - Render: Automatically builds and deploys backend

3. **Rollback**:
   - Both platforms allow instant rollback to previous deployments

---

## 📊 Monitoring

### Backend (Render):
- View logs: Dashboard → Logs
- Monitor performance: Dashboard → Metrics
- Check health: Visit `/api/health` endpoint

### Frontend (Vercel):
- View deployments: Dashboard → Deployments
- Monitor analytics: Dashboard → Analytics
- Check errors: Dashboard → Functions

### MongoDB Atlas:
- Monitor connections: Dashboard → Metrics
- View logs: Dashboard → Logs
- Set up alerts: Dashboard → Alerts

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** to Git
2. **Use strong JWT secrets** (64+ characters)
3. **Enable MongoDB Atlas IP Whitelist** (after deployment, restrict to specific IPs)
4. **Use HTTPS only** (both platforms provide free SSL)
5. **Rotate secrets regularly** (JWT, MongoDB password)
6. **Monitor for suspicious activity** in logs
7. **Keep dependencies updated**: `npm audit fix`

---

## 📝 Deployment Checklist

Before going live:

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on both platforms
- [ ] Google OAuth configured with production URLs
- [ ] CORS configured correctly
- [ ] All features tested in production
- [ ] Custom domain configured (if applicable)
- [ ] Monitoring and logging set up
- [ ] Backup strategy in place for MongoDB

---

## 🎉 You're Live!

Your Algorithm Visualizer is now accessible worldwide at:
- Frontend: `https://algo-visualizer.vercel.app`
- Backend API: `https://algo-visualizer-api.onrender.com/api`

Share your project with:
```
🚀 Algorithm Visualizer - Learn algorithms visually!
🔗 https://algo-visualizer.vercel.app
✨ Features: Interactive visualizations, AI-powered code playground, Google OAuth
```

---

## 📞 Need Help?

If you encounter issues:
1. Check the logs on Render/Vercel
2. Review the troubleshooting section above
3. Test locally with production environment variables
4. Check MongoDB Atlas connection
5. Verify Google Cloud Console settings

Good luck with your deployment! 🚀
