# AFH Project Migration Guide

## Overview
Migrate the AFH project from personal accounts to the official AFH organizational accounts.

---

## 🎯 Migration Checklist

### ✅ Accounts to Use
- **Email**: `afh.digital.art@gmail.com`
- **Password**: `YouthArt$Studio17`
- **GitHub**: `afhdigitalart-netizen`

---

## 📋 Step-by-Step Migration

### 1. GitHub Repository Migration (START HERE)

#### Current Status:
- ❌ Repository: `JumboCode/artists-for-humanity`
- ✅ Admin access granted to AFH repo

#### Migration Steps:

**Option A: Transfer Existing Repository (Recommended)**
1. Go to the current repo: https://github.com/JumboCode/artists-for-humanity
2. Click **Settings** (requires admin access)
3. Scroll to bottom → **Danger Zone** → **Transfer ownership**
4. Transfer to: `afhdigitalart-netizen`
5. Confirm transfer

**Option B: Create New Repository & Push**
1. Create new repo at: https://github.com/afhdigitalart-netizen
2. Name it: `artists-for-humanity` or `afh-digital-portfolio`
3. Make it **Private** (or Public if desired)
4. Don't initialize with README (we'll push existing code)

**Update Local Git Remote:**
```powershell
# Remove old remote
git remote remove origin

# Add new remote (replace USERNAME with actual username)
git remote add origin https://github.com/afhdigitalart-netizen/artists-for-humanity.git

# Verify
git remote -v

# Push all branches
git push -u origin main

# Push all tags (if any)
git push origin --tags
```

---

### 2. Cloudinary Migration

#### Current Status:
- ❌ Account: `dzqbeenus` (personal account)
- ❌ Need: AFH organizational account

#### Migration Steps:

**A. Create New Cloudinary Account**
1. Go to: https://cloudinary.com/users/register/free
2. Use email: `afh.digital.art@gmail.com`
3. Set password: `YouthArt$Studio17`
4. Choose plan: **Free** (25GB storage, 25 credits/month)
5. Complete verification

**B. Configure Upload Settings**
1. After login, go to **Settings** → **Upload**
2. Create upload preset:
   - Click **Add upload preset**
   - Preset name: `afh-unsigned`
   - Signing mode: **Unsigned**
   - Folder: `artwork-uploads`
   - Max file size: 10485760 (10MB)
   - Allowed formats: jpg,png,gif,webp
   - Save
3. Create second preset for profiles:
   - Preset name: `afh-profile-uploads`
   - Signing mode: **Unsigned**
   - Folder: `profile-images`
   - Max file size: 10485760 (10MB)
   - Allowed formats: jpg,png,gif,webp
   - Save

**C. Get New Credentials**
1. Go to **Dashboard**: https://cloudinary.com/console
2. Copy these values:
   - **Cloud name**: (should be something like `afh-digital-art`)
   - **API Key**: (will be shown)
   - **API Secret**: Click "reveal" to see it

**D. Update Environment Variables**
Edit `.env.local` and `.env` with new values:
```env
# Cloudinary Configuration (AFH Account)
CLOUDINARY_CLOUD_NAME="your-new-cloud-name"
CLOUDINARY_API_KEY="your-new-api-key"
CLOUDINARY_API_SECRET="your-new-api-secret"

# Client-side configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-new-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="afh-unsigned"
```

**E. Migrate Existing Images (If Needed)**
If you have existing artwork/profile images in the old account:
1. **Manual migration**: Download images from old account, re-upload to new
2. **Keep old account temporarily**: Old images will still work with old URLs until you migrate
3. **Best practice**: Have users re-upload their images to the new account

---

### 3. Neon Database (Check Current Status)

#### Current Database:
```
DATABASE_URL="postgresql://neondb_owner:npg_AmzKtq0suiN3@ep-floral-dew-a44us8lt-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

#### Check if Migration Needed:
1. Go to: https://console.neon.tech
2. Login to check if this database is under:
   - ❓ Personal account → **Need to migrate**
   - ✅ AFH account → **No action needed**

#### If Migration Needed:

**Option A: Transfer Project (If Supported)**
1. Login to Neon
2. Go to project settings
3. Transfer to AFH team/account if available

**Option B: Create New Database & Migrate Data**
1. Create new Neon account with `afh.digital.art@gmail.com`
2. Create new project: "AFH Digital Portfolio"
3. Get new DATABASE_URL
4. Export data from old database:
   ```powershell
   npx prisma db pull
   ```
5. Update `.env.local` with new DATABASE_URL
6. Push schema to new database:
   ```powershell
   npx prisma db push
   ```
7. Migrate data (if you have existing data to preserve)

---

### 4. Vercel Deployment (Future)

When ready to deploy:
1. Go to: https://vercel.com
2. Sign up/Login with: `afh.digital.art@gmail.com`
3. Import repository from: `afhdigitalart-netizen/artists-for-humanity`
4. Add environment variables (all the ones from `.env.local`)
5. Deploy

---

## 🔒 Security Checklist

After migration:
- [ ] Update `.env.local` with new credentials
- [ ] Update `.env` with new credentials
- [ ] Verify `.gitignore` includes `.env` and `.env.local`
- [ ] Delete old Cloudinary account (after images migrated)
- [ ] Delete old Neon database (after data migrated)
- [ ] Update team members with new credentials
- [ ] Change passwords if shared during development

---

## 📝 Environment Variables Summary

After all migrations, your `.env.local` should have:

```env
# Database (Neon PostgreSQL - AFH account)
DATABASE_URL="postgresql://[NEW_CREDENTIALS]"

# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"  # Update to production URL when deploying
NEXTAUTH_SECRET="6JmTwbOKCzAp5tdWsa9euhgXf8PxqvRl"  # Keep or regenerate

# Cloudinary Configuration (AFH Account)
CLOUDINARY_CLOUD_NAME="afh-new-cloud-name"
CLOUDINARY_API_KEY="new-api-key"
CLOUDINARY_API_SECRET="new-api-secret"

# Client-side configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="afh-new-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="afh-unsigned"
```

---

## 🚀 Testing After Migration

1. **Test Git Push**:
   ```powershell
   git add .
   git commit -m "test: verify new GitHub remote"
   git push origin main
   ```

2. **Test Cloudinary Upload**:
   - Restart dev server: `npm run dev`
   - Go to profile page
   - Try uploading a profile picture
   - Verify it appears in new Cloudinary dashboard

3. **Test Database**:
   - Run: `npx prisma studio`
   - Verify you see your data
   - Try creating a new user/artwork

4. **Verify Environment Variables**:
   ```powershell
   # This should show your new cloud name
   echo $env:NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   ```

---

## ⚠️ Common Issues

### Git Push Fails (Authentication)
**Fix**: Use Personal Access Token
1. Go to GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. When prompted for password during push, use the token

### Cloudinary Upload Fails
**Fix**: Check upload preset
- Ensure preset name matches exactly in .env
- Ensure preset is set to "Unsigned"
- Restart dev server after changing .env

### Database Connection Fails
**Fix**: Check DATABASE_URL format
- Must include `sslmode=require`
- No spaces in URL
- Check if IP is whitelisted in Neon settings

---

## 📞 Support

If you encounter issues:
1. Check the error message carefully
2. Verify all credentials are correct
3. Restart dev server after changing environment variables
4. Check service dashboards (GitHub, Cloudinary, Neon) for status issues

---

## ✅ Migration Complete Checklist

- [ ] GitHub repository transferred/pushed to afhdigitalart-netizen
- [ ] Local git remote updated and tested
- [ ] New Cloudinary account created under afh.digital.art@gmail.com
- [ ] Cloudinary upload presets configured
- [ ] Environment variables updated with new Cloudinary credentials
- [ ] Neon database checked/migrated if needed
- [ ] All services tested locally
- [ ] Old credentials documented for reference
- [ ] Team notified of new credentials

**Once all items checked, you're ready to proceed with profile picture feature and deployment!**
