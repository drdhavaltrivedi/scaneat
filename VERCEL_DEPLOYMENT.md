# Vercel Deployment Guide

## Quick Deployment Steps

Your code has been pushed to GitHub and is ready to deploy to Vercel!

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**: Visit https://vercel.com
2. **Sign up/Login**: Create an account or log in (you can use GitHub to sign in)
3. **Import Project**: 
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository: `drdhavaltrivedi/scaneat`
4. **Configure Project**:
   - **Root Directory**: Leave this as the repository root (don't set it to `web`)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `cd web && npm run build` (configured in vercel.json)
   - **Output Directory**: `web/.next` (configured in vercel.json)
   
   **Note**: The project now has a root `package.json` that handles the build process. Vercel will run from the repository root, and the vercel.json will automatically change to the `web` directory for building.
5. **Environment Variables** (if needed):
   - Add any Firebase or API keys if required
6. **Deploy**: Click "Deploy"

### Option 2: Deploy via CLI

1. **Install and Login**:
   ```bash
   cd /home/brilworks/scaneat
   npx vercel login
   ```

2. **Deploy**:
   ```bash
   npx vercel --prod
   ```

3. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm root directory is `web`
   - Deploy!

### Important Notes

- ✅ Code is already pushed to GitHub: `https://github.com/drdhavaltrivedi/scaneat.git`
- ✅ Vercel configuration is set in `vercel.json` with `rootDirectory: "web"`
- ✅ Camera permissions are fixed for mobile browsers
- ✅ HTTPS is automatically provided by Vercel (required for camera access)

### After Deployment

1. Your app will be live at: `https://your-project-name.vercel.app`
2. Camera permissions will work on mobile browsers (HTTPS is required)
3. You can set up a custom domain in Vercel dashboard if needed

### Troubleshooting

- If build fails, check that `rootDirectory` is set to `web` in Vercel dashboard
- Make sure all dependencies are in `web/package.json`
- Check Vercel build logs for any errors

