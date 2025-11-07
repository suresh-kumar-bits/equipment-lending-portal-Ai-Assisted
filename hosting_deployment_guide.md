# 🚀 Free Hosting & Deployment Guide

## Overview
This guide shows you how to host your Equipment Lending Portal for **FREE** and share it with your connections.

---

## 📊 Recommended Stack

| Component | Service | Free Tier | Status |
|-----------|---------|-----------|--------|
| **Frontend (React)** | Vercel or Netlify | Yes (Unlimited) | Recommended |
| **Backend (Node.js)** | Render or Railway | Yes (Limited) | Recommended |
| **Database (MongoDB)** | MongoDB Atlas | Yes (512MB) | Required |

---

## 🗄️ Step 1: Database Setup (MongoDB Atlas)

### Create Free MongoDB Cluster

1. **Go to MongoDB Atlas**
   - Website: https://www.mongodb.com/cloud/atlas
   - Click "Start Free"

2. **Create Account**
   - Sign up with email or Google
   - Verify email

3. **Create Cluster**
   - Choose Free tier (M0 Sandbox)
   - Select region closest to you
   - Create cluster (takes 1-3 minutes)

4. **Setup Database User**
   - Go to "Database Access"
   - Create username and password
   - Save these credentials

5. **Get Connection String**
   - Go to "Databases" → "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your password
   - Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/equipment-portal`

6. **Add IP Address**
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all IPs - for free tier)

✅ **Now you have cloud database ready!**

---

## 🔧 Step 2: Backend Deployment (Render)

### Deploy Node.js Backend to Render

1. **Go to Render**
   - Website: https://render.com
   - Click "Sign up"
   - Use GitHub account (easier)

2. **Create New Service**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure Service**
   - **Name:** equipment-lending-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. **Add Environment Variables**
   - Click "Environment"
   - Add variables:
     ```
     MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/equipment-portal
     JWT_SECRET = your_secret_key_here
     CORS_ORIGIN = https://your-frontend-url.com
     PORT = 10000
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - You'll get a URL like: `https://equipment-lending-backend.onrender.com`

✅ **Backend is live!**

### Note: Render Free Tier Limitations
- ⏱️ Spins down after 15 minutes of inactivity
- 🔄 First request takes 50+ seconds to wake up
- 💾 Limited to 0.5GB memory

---

## 🎨 Step 3: Frontend Deployment (Vercel)

### Deploy React Frontend to Vercel

1. **Go to Vercel**
   - Website: https://vercel.com
   - Click "Sign Up"
   - Connect GitHub account

2. **Import Project**
   - Click "Add New"
   - Select "Project"
   - Select your repository
   - Choose "equipment-lending-portal" folder

3. **Configure Project**
   - **Framework Preset:** Create React App
   - **Root Directory:** `./frontend`
   - Click "Deploy"

4. **Update Backend URL**
   - After first deployment fails, go to Project Settings
   - Add Environment Variable:
     ```
     REACT_APP_API_URL = https://equipment-lending-backend.onrender.com
     ```
   - Update `frontend/src/services/api.js`:
     ```javascript
     const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
     ```

5. **Redeploy**
   - Trigger redeploy from Vercel dashboard
   - Wait for deployment

✅ **Frontend is live!**

### Note: Vercel Free Tier
- ✅ Unlimited deployments
- ✅ Instant cold start (no wake-up time)
- ✅ 100GB bandwidth per month
- ✅ Up to 12 serverless functions

---

## 🔗 Step 4: Connect Frontend to Backend

### Update API URL

**File: `frontend/src/services/api.js`**

```javascript
// Change this:
const API_BASE_URL = 'http://localhost:5000';

// To this:
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

**File: `frontend/.env` (create if doesn't exist)**

```
REACT_APP_API_URL=https://equipment-lending-backend.onrender.com
```

### Update Backend CORS

**File: `backend/src/server.js`**

```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
```

**File: `backend/.env`**

```
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

---

## 📱 Alternative: Netlify (for Frontend)

### Deploy to Netlify Instead of Vercel

1. **Go to Netlify**
   - Website: https://www.netlify.com
   - Click "Sign up"
   - Connect GitHub

2. **Deploy**
   - Select repository
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/build`
   - Deploy

✅ **Frontend on Netlify**

---

## 📦 Alternative: Railway (for Backend)

### Deploy to Railway Instead of Render

1. **Go to Railway**
   - Website: https://railway.app
   - Click "Start Project"
   - Select "GitHub Repo"

2. **Configure**
   - Select your repository
   - Add environment variables
   - Deploy

✅ **Backend on Railway**

---

## 🌍 Final URLs to Share

After deployment, you'll have:

```
Frontend URL: https://your-frontend.vercel.app
Backend URL: https://equipment-lending-backend.onrender.com

Share this link with connections:
👉 https://your-frontend.vercel.app
```

---

## 📋 Step-by-Step Checklist

### Phase 1: Database
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster
- [ ] Create database user
- [ ] Get connection string
- [ ] Whitelist all IPs (0.0.0.0/0)

### Phase 2: Backend
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and test
- [ ] Get backend URL

### Phase 3: Frontend
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy and test
- [ ] Get frontend URL

### Phase 4: Integration
- [ ] Update API_BASE_URL in frontend
- [ ] Update CORS_ORIGIN in backend
- [ ] Test all features
- [ ] Share link with connections

---

## 🧪 Testing After Deployment

### Test Login
1. Go to your frontend URL
2. Login with test credentials:
   ```
   Email: student@example.com
   Password: password123
   Role: Student
   ```

### Test Features
- [ ] Login works
- [ ] Can see equipment
- [ ] Can request equipment
- [ ] Admin can approve requests
- [ ] All pages load

### Common Issues

**Issue: "Cannot connect to backend"**
- Solution: Check CORS_ORIGIN in backend matches frontend URL
- Solution: Verify MongoDB URI is correct
- Solution: Wait 2-3 minutes for Render to start

**Issue: "Page loads but no data"**
- Solution: Check browser console (F12) for errors
- Solution: Check API URL is correct
- Solution: Verify backend is running

**Issue: "Backend takes 50+ seconds to respond"**
- Solution: Normal for Render free tier (first request wakes it up)
- Solution: Wait or upgrade to paid tier

---

## 💡 Tips for Free Tier

### Maximize Free Tier Usage
1. **Render Free Tier:** Spins down after 15 minutes
   - Keep-alive: Use a cron job to ping backend every 10 minutes
   - Or upgrade to $7/month paid tier

2. **Vercel Free Tier:** No limitations
   - Perfect for React frontend

3. **MongoDB Atlas Free Tier:** 512MB storage
   - Perfect for small projects
   - Enough for 1000s of records

### Cost Optimization
| Service | Free | Paid | Recommendation |
|---------|------|------|-----------------|
| Vercel | Yes | $20/mo | Use Free |
| Render | Yes | $7/mo | Use Free (with limitations) |
| MongoDB Atlas | Yes | $57/mo | Use Free |
| **Total** | **$0** | **$84+/mo** | **Free tier sufficient** |

---

## 🔗 Useful Resources

### Hosting Services
- [Vercel](https://vercel.com) - Frontend hosting
- [Netlify](https://netlify.com) - Frontend alternative
- [Render](https://render.com) - Backend hosting
- [Railway](https://railway.app) - Backend alternative
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database

### Documentation
- [Vercel Deployment Guide](https://vercel.com/docs)
- [Render Deployment Guide](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)

---

## 📞 Support

### If Deployment Fails

1. **Check Logs**
   - Vercel: Check "Deployments" → Logs
   - Render: Check "Logs" tab

2. **Common Errors**
   - `Module not found`: Missing dependencies (npm install)
   - `Connection refused`: MongoDB URI incorrect
   - `CORS error`: Update CORS_ORIGIN

3. **Debug Steps**
   - Verify .env variables are correct
   - Check GitHub repository is connected
   - Test locally first (npm start)
   - Review deployment logs carefully

---

## ✨ You're Done!

Your website is now **LIVE and SHAREABLE!**

### Share with Connections
```
📧 Email Subject: Check Out My Equipment Lending Portal!

👋 Hi,

I built a web application for school equipment management. 
Check it out here: 👉 https://your-frontend.vercel.app

Features:
✅ Browse equipment
✅ Request borrowing
✅ Track requests
✅ Admin management

Login with test account:
📧 student@example.com
🔐 password123

Feel free to test it out!
```

---

**Deployment Date:** [Your Date]  
**Frontend URL:** [Your URL]  
**Backend URL:** [Your URL]  
**Status:** ✅ Live & Ready