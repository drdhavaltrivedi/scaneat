# ✅ Vercel Deployment Fix

## Problem
```
Error: Command "cd web && npm install" exited with 1
sh: line 1: cd: web: No such file or directory
```

## Solution Applied

1. **Updated `vercel.json`:**
   - Set `rootDirectory: "web"` - This tells Vercel where the app is
   - Simplified build commands to work from the web directory
   - Removed unnecessary path prefixes

2. **Created `.vercelignore`:**
   - Excludes unnecessary files from deployment
   - Reduces build time

## ✅ Fixed Configuration

The `vercel.json` now correctly:
- Sets root directory to `web`
- Uses correct build commands
- Configures Next.js framework

## 🔄 Next Steps

1. **Redeploy on Vercel:**
   - Go to your Vercel dashboard
   - The new commit should trigger a redeploy automatically
   - Or manually trigger a new deployment

2. **Verify Settings in Vercel Dashboard:**
   - Go to Project Settings → General
   - Ensure **Root Directory** is set to: `web`
   - Framework Preset: **Next.js**

3. **Environment Variables:**
   Make sure these are set in Vercel:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📝 Manual Vercel Settings

If automatic detection doesn't work, manually set in Vercel dashboard:

1. **Project Settings → General:**
   - Root Directory: `web`
   - Framework Preset: `Next.js`
   - Build Command: `npm run build` (or leave empty for auto)
   - Output Directory: `.next` (or leave empty for auto)
   - Install Command: `npm install` (or leave empty for auto)

2. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger auto-deploy

## ✅ Status

- ✅ `vercel.json` updated
- ✅ `.vercelignore` created
- ✅ Changes pushed to GitHub
- ⏳ Vercel will auto-redeploy with new configuration

---

**The fix has been pushed to GitHub. Vercel should automatically redeploy with the correct configuration!**

