# 🚀 Deploy AFH Portfolio NOW - Quick Guide

## Step-by-Step Deployment (15 minutes)

### 1️⃣ Login to Vercel (3 min)
1. Go to [https://vercel.com](https://vercel.com)
2. **Sign Out** of any personal accounts first
3. Click **"Sign In"**
4. Use AFH account:
   - Email: `afh.digital.art@gmail.com`
   - Password: `YouthArt$Studio17`

---

### 2️⃣ Import GitHub Repository (2 min)
1. Click **"Add New Project"**
2. Click **"Import Git Repository"**
3. **Important:** Switch to AFH organization in the dropdown
4. Select the **AFH** repository
5. Click **"Import"**

---

### 3️⃣ Add Environment Variables (5 min)

In the deployment settings, click **"Environment Variables"** and add these **EXACT VALUES**:

**Database:**
```
DATABASE_URL
```
```
postgresql://neondb_owner:npg_AmzKtq0suiN3@ep-floral-dew-a44us8lt-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**NextAuth Secret:**
```
NEXTAUTH_SECRET
```
```
6JmTwbOKCzAp5tdWsa9euhgXf8PxqvRl
```

**NextAuth URL (TEMPORARY - Will update after deploy):**
```
NEXTAUTH_URL
```
```
https://your-site.vercel.app
```

**Cloudinary Cloud Name:**
```
CLOUDINARY_CLOUD_NAME
```
```
dzqbeenus
```

**Cloudinary API Key:**
```
CLOUDINARY_API_KEY
```
```
541194484279721
```

**Cloudinary API Secret:**
```
CLOUDINARY_API_SECRET
```
```
mRDz9jwsAzGo0xIQw3qt8i5nFFY
```

---

### 4️⃣ Configure Build Settings (1 min)

**Build Command:**
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

**Install Command:**
```bash
npm install
```

**Output Directory:**
```
.next
```

**Node.js Version:** 18.x

---

### 5️⃣ Deploy! (2 min)
1. Click **"Deploy"**
2. Wait 2-5 minutes for build
3. Copy your production URL (e.g., `https://afh-portfolio.vercel.app`)

---

### 6️⃣ Update NEXTAUTH_URL (2 min)
1. Go to **Settings → Environment Variables**
2. Find `NEXTAUTH_URL`
3. Click **Edit**
4. Replace with your actual URL (from step 5)
5. Click **"Redeploy"** to apply changes

---

## ✅ Test Your Site

Visit these pages and verify they work:

1. **Homepage:** `https://your-site.vercel.app/`
   - Should show artwork gallery
   - Search and filter should work

2. **Upload:** `https://your-site.vercel.app/upload`
   - Try uploading a small image (test with 1-2 MB file)
   - Fill in artwork details
   - Click Submit
   - Should succeed without errors

3. **Sign Up:** `https://your-site.vercel.app/sign-up`
   - Register account with `afh.digital.art@gmail.com`
   - Choose username

4. **Login:** `https://your-site.vercel.app/login`
   - Login with account created above

5. **Admin Dashboard:** `https://your-site.vercel.app/admin`
   - Will need to set admin role first (see below)

---

## 🔑 Make Yourself Admin

Go to [Neon Console](https://console.neon.tech):

1. Login with `afh.digital.art@gmail.com` / `YouthArt$Studio17`
2. Select your database
3. Go to **SQL Editor**
4. Run:
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'afh.digital.art@gmail.com';
```
5. Now you can access `/admin` dashboard!

---

## 🎉 You're Live!

Your site is now deployed at your Vercel URL.

**Next Steps:**
1. Test artwork upload and approval flow
2. Invite students to create accounts
3. Monitor uploads in admin dashboard
4. *(Optional)* Add custom domain later

---

## ❓ Troubleshooting

**Build fails?**
- Check that all environment variables are exactly as shown above
- Check Vercel build logs for specific errors

**Images not uploading?**
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard to confirm uploads

**Can't access admin dashboard?**
- Make sure you ran the SQL command to set ADMIN role
- Try logging out and back in

**Need help?**
- Check full guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Check Vercel deployment logs
- Check browser console for errors

---

**Account Info (Save this!):**
- **All Services Use:** `afh.digital.art@gmail.com` / `YouthArt$Studio17`
- **Services:** GitHub, Vercel, Neon, Cloudinary, Gmail

**Last Updated:** March 8, 2026
