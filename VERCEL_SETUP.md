# ✅ Vercel Setup Instructions

## ⚠️ Important: Set Root Directory in Vercel Dashboard

The `rootDirectory` property is **NOT** valid in `vercel.json`. You must set it in the Vercel dashboard instead.

## 📋 Step-by-Step Setup

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on the `scaneat` project

### 3. Go to Settings
Click **"Settings"** tab

### 4. Configure General Settings
Go to **"General"** section

### 5. Set Root Directory
- Find **"Root Directory"** field
- Click **"Edit"**
- Enter: `web`
- Click **"Save"**

### 6. Verify Framework
- **Framework Preset:** Should be `Next.js` (auto-detected)
- **Build Command:** Leave empty (auto) or set to `npm run build`
- **Output Directory:** Leave empty (auto) or set to `.next`
- **Install Command:** Leave empty (auto) or set to `npm install`

### 7. Add Environment Variables
Go to **"Environment Variables"** section and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=scaneat-bc079.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=scaneat-bc079
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=scaneat-bc079.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 8. Redeploy
- Go to **"Deployments"** tab
- Click **"Redeploy"** on the latest deployment
- Or push a new commit to trigger auto-deploy

## ✅ Current vercel.json

The `vercel.json` is now correctly configured without `rootDirectory`:

```json
{
  "buildCommand": "npm install && npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

**Note:** These commands will run from the `web` directory once you set Root Directory in the dashboard.

## 🎯 Quick Checklist

- [ ] Root Directory set to `web` in Vercel dashboard
- [ ] Environment variables added
- [ ] Framework preset: Next.js
- [ ] Redeploy triggered

---

**Set Root Directory to `web` in Vercel dashboard, then redeploy!**

