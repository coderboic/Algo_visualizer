# 🚀 Quick Deployment Reference

## Fast Track Deployment (30 minutes)

### Prerequisites
- [ ] GitHub account
- [ ] Google Cloud Console account (for OAuth)
- [ ] Credit/Debit card for platform verification (no charges on free tier)

---

## Step-by-Step Deployment

### 1️⃣ MongoDB Atlas Setup (5 min)

```bash
1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up → Create FREE M0 Cluster
3. Create Database User (save username & password)
4. Network Access → Allow 0.0.0.0/0
5. Copy Connection String:
   mongodb+srv://username:password@cluster.mongodb.net/
```

**✅ Checklist:**
- [ ] Cluster created
- [ ] Database user created
- [ ] Connection string copied

---

### 2️⃣ Generate Secrets (1 min)

```bash
# Generate two secrets and save them
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**✅ Checklist:**
- [ ] JWT_SECRET generated
- [ ] REFRESH_TOKEN_SECRET generated

---

### 3️⃣ Backend Deployment on Render (10 min)

```bash
1. Visit: https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Connect your GitHub repo
5. Configure:
   - Name: algo-visualizer-api
   - Root Directory: backend
   - Build: npm install && npm run build
   - Start: npm start
6. Add Environment Variables:
```

**Environment Variables:**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=<paste_generated_secret_1>
REFRESH_TOKEN_SECRET=<paste_generated_secret_2>
MONGODB_URI=<paste_mongodb_connection_string>
GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
GEMINI_API_KEY=AIzaSyD_R77cz7PiGscHWb5AU2MeYMykQNxx4l0
FRONTEND_URL=https://algo-visualizer.vercel.app
```

7. Deploy → Wait for build

**Your backend URL:** `https://algo-visualizer-api.onrender.com`

**✅ Checklist:**
- [ ] Web service created
- [ ] All environment variables added
- [ ] Build successful
- [ ] Backend is live

---

### 4️⃣ Frontend Deployment on Vercel (10 min)

```bash
1. Visit: https://vercel.com
2. Sign up with GitHub
3. Add New → Project
4. Import your GitHub repo
5. Configure:
   - Framework: Vite
   - Root Directory: frontend
   - Build: npm run build
   - Output: dist
6. Add Environment Variables:
```

**Environment Variables:**
```
VITE_API_URL=https://algo-visualizer-api.onrender.com/api
VITE_GOOGLE_CLIENT_ID=716931930099-5j2cocc4f6f1aceh4j9vfahshvq6t1ng.apps.googleusercontent.com
```

7. Deploy → Wait for build

**Your frontend URL:** `https://algo-visualizer.vercel.app`

**✅ Checklist:**
- [ ] Project imported
- [ ] Environment variables added
- [ ] Build successful
- [ ] Frontend is live

---

### 5️⃣ Update Google OAuth (5 min)

```bash
1. Visit: https://console.cloud.google.com/apis/credentials
2. Select your OAuth Client ID
3. Add Authorized JavaScript origins:
   - https://algo-visualizer.vercel.app
   - https://algo-visualizer-api.onrender.com
4. Add Authorized redirect URIs:
   - https://algo-visualizer.vercel.app
   - https://algo-visualizer-api.onrender.com/api/auth/google/callback
5. Save
```

**✅ Checklist:**
- [ ] Origins added
- [ ] Redirect URIs added
- [ ] Changes saved

---

## 🎯 Testing Checklist

Visit your deployed app: `https://algo-visualizer.vercel.app`

- [ ] Homepage loads
- [ ] Can navigate to different pages
- [ ] Regular signup works
- [ ] Regular login works
- [ ] Google OAuth login works
- [ ] Algorithm visualizations work
- [ ] Code playground works
- [ ] AI code fixing works

---

## 🐛 Quick Troubleshooting

### Backend not responding
```bash
# Check Render logs
Dashboard → Select Service → Logs
```

### CORS errors
```bash
# Verify FRONTEND_URL in Render environment variables
FRONTEND_URL=https://your-exact-vercel-url.vercel.app
```

### Google OAuth fails
```bash
# Wait 5 minutes after updating Google Console
# Clear browser cache
# Check authorized origins match exactly
```

### MongoDB connection fails
```bash
# Verify connection string format:
mongodb+srv://username:password@cluster.mongodb.net/dbname
# Check password doesn't have special characters
# Ensure IP whitelist is set to 0.0.0.0/0
```

---

## 📊 Verify Deployment

### Backend Health Check
```bash
curl https://algo-visualizer-api.onrender.com/api/health
# Should return: {"status":"ok",...}
```

### Frontend Check
```bash
# Open in browser
https://algo-visualizer.vercel.app
# Should load the app
```

### API Connection Test
```bash
# Open browser console on frontend
# Should see successful API calls
# No CORS errors
```

---

## 🔄 Making Updates

### Update Backend
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render auto-deploys in 2-3 minutes
```

### Update Frontend
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys in 1-2 minutes
```

---

## 💡 Pro Tips

1. **Free Tier Limitation**: Render backend sleeps after 15 min of inactivity
   - First request after sleep takes 30-60 seconds
   - Upgrade to $7/month for always-on

2. **Monitor Logs**: Check Render and Vercel dashboards regularly

3. **Set Up Alerts**: Configure MongoDB Atlas alerts for:
   - High connection count
   - Low storage space
   - Query performance

4. **Backup Database**: Export MongoDB data weekly

5. **Update Dependencies**: Run `npm audit fix` monthly

---

## 📞 Need Help?

1. Check `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Review error logs on Render/Vercel
3. Test locally with production environment variables
4. Check MongoDB Atlas metrics
5. Verify Google Cloud Console settings

---

## ✅ Deployment Complete!

🎉 Your Algorithm Visualizer is now live!

**Share your project:**
```
🚀 Algorithm Visualizer
🔗 https://algo-visualizer.vercel.app
✨ Interactive algorithm visualizations with AI-powered code playground
```

**Next Steps:**
- Share on social media
- Add to your portfolio
- Get user feedback
- Iterate and improve
