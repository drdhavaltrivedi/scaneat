# 🔧 Fix GitHub Push Permission Error

## Problem
```
remote: Permission to drdhavaltrivedi/scaneat.git denied to dhaval1mak.
fatal: unable to access 'https://github.com/drdhavaltrivedi/scaneat.git/': The requested URL returned error: 403
```

This happens because your local git is using a different GitHub account (`dhaval1mak`) than the repository owner (`drdhavaltrivedi`).

## ✅ Solution Options

### Option 1: Use Personal Access Token (Easiest)

1. **Create a Personal Access Token:**
   - Visit: https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**
   - Name: `Scaneat Push Token`
   - Expiration: Choose your preference
   - Select scopes: ✅ **repo** (all repository permissions)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (you won't see it again!)

2. **Update remote URL with token:**
   ```bash
   cd /home/brilworks/scaneat
   git remote set-url origin https://YOUR_TOKEN@github.com/drdhavaltrivedi/scaneat.git
   git push -u origin main
   ```
   
   Replace `YOUR_TOKEN` with the token you copied.

### Option 2: Use GitHub CLI

```bash
cd /home/brilworks/scaneat

# Login with correct account
gh auth login

# Select: GitHub.com
# Select: HTTPS
# Authenticate: Login with a web browser
# Follow the browser prompts

# Then push
git push -u origin main
```

### Option 3: Use SSH (If SSH key is configured)

1. **Check if SSH key exists:**
   ```bash
   ls -la ~/.ssh/id_*.pub
   ```

2. **If no SSH key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   cat ~/.ssh/id_ed25519.pub
   ```
   
3. **Add SSH key to GitHub:**
   - Visit: https://github.com/settings/keys
   - Click **"New SSH key"**
   - Paste the public key
   - Save

4. **Update remote to use SSH:**
   ```bash
   cd /home/brilworks/scaneat
   git remote set-url origin git@github.com:drdhavaltrivedi/scaneat.git
   git push -u origin main
   ```

### Option 4: Transfer Repository Ownership

If `dhaval1mak` should have access:
1. Go to: https://github.com/drdhavaltrivedi/scaneat/settings/access
2. Add `dhaval1mak` as a collaborator
3. Then push normally

## 🚀 Quick Fix (Recommended)

**Use Personal Access Token:**

```bash
cd /home/brilworks/scaneat

# Step 1: Get token from https://github.com/settings/tokens
# Step 2: Replace YOUR_TOKEN below with your actual token
git remote set-url origin https://YOUR_TOKEN@github.com/drdhavaltrivedi/scaneat.git

# Step 3: Push
git push -u origin main
```

## 🔍 Verify

After fixing, verify the remote:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/drdhavaltrivedi/scaneat.git (fetch)
origin  https://github.com/drdhavaltrivedi/scaneat.git (push)
```

## 📝 Notes

- Personal Access Tokens are the easiest solution
- Tokens are more secure than passwords
- You can revoke tokens anytime from GitHub settings
- SSH keys are good for long-term use

---

**Choose Option 1 (Personal Access Token) for the quickest fix!**

