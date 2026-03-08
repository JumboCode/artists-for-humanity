# AFH Digital Portfolio - Deployment Guide

## ✅ What's Been Completed (MVP Ready!)

### 🎨 **Frontend Features**
1. ✅ **Auth-Aware Navbar**
   - Shows profile dropdown with avatar when logged in
   - Shows "Login" when logged out  
   - Admin users see "Admin Dashboard" link
   - Mobile-responsive hamburger menu

2. ✅ **Homepage with Real Data**
   - Fetches artwork from `/api/artworks`
   - Falls back to mock data if API fails
   - Displays approved artworks only
   - Carousel working with existing UI

3. ✅ **Upload Page**
   - Supports both authenticated and guest uploads
   - Integrates with Cloudinary

4. ✅ **Admin Dashboard**
   - View pending artwork submissions
   - Approve, Reject, Feature actions
   - Edit artwork details
   - Reassign guest uploads to registered users

### 🔧 **Backend Features**
1. ✅ **Cloudinary Integration**
   - Real image/video uploads to cloud storage
   - Automatic thumbnail generation
   - Organized folder structure (`afh/artworks/{userId}`)

2. ✅ **Authentication System**
   - NextAuth with Prisma adapter
   - User registration and login
   - Role-based access (ADMIN, STUDENT, MENTOR)

3. ✅ **API Routes Completed**
   - `GET /api/artworks` - Fetch approved artwork
   - `POST /api/artworks` - Upload artwork (auth optional)
   - `GET /api/admin/queue` - Get pending artwork
   - `PATCH /api/admin/artworks/[id]` - Approve/Reject/Edit
   - `PATCH /api/admin/artworks/[id]/reassign` - Reassign to user
   - `PATCH /api/admin/artworks/[id]/feature` - Feature artwork

4. ✅ **Database Schema (Prisma + Neon)**
   - User, Profile, Artwork, AdminAction models
   - Proper relations and indexes
   - Migration files ready

---

## 🚀 Deployment to Vercel

### Prerequisites
- Vercel account (use `afh.digital.art@gmail.com`)
- Cloudinary account (get credentials)
- Neon PostgreSQL database

### Step 1: Set Up Environment Variables in Vercel

Go to your Vercel project settings → Environment Variables and add:

```bash
# Database
DATABASE_URL=your_neon_postgres_url

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2: Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import the `artists-for-humanity` GitHub repository
4. Vercel will auto-detect Next.js settings

### Step 3: Configure Build Settings

Vercel should auto-detect these, but verify:
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### Step 4: Deploy

1. Push your latest code to GitHub:
   ```bash
   git push origin main
   ```

2. Vercel will automatically deploy

3. Run database migrations after first deploy:
   - You may need to run `npx prisma migrate deploy` in Vercel's terminal
   - Or use Vercel's build command: `npx prisma migrate deploy && next build`

### Step 5: Verify Deployment

Test these pages:
- ✅ Homepage (`/`) - Should show artwork
- ✅ Login (`/login`) - Should allow sign in
- ✅ Sign Up (`/sign-up`) - Should allow registration
- ✅ Upload (`/upload`) - Should allow uploads
- ✅ Admin Dashboard (`/admin`) - Admins only

---

## 🔑 Creating Admin Users

After deployment, you'll need to manually set a user as admin in the database:

### Option 1: Using Neon SQL Editor
```sql
UPDATE "User" 
SET role = 'ADMIN' 
WHERE email = 'your-admin-email@example.com';
```

### Option 2: Using Prisma Studio
```bash
npx prisma studio
# Opens browser interface to edit database
# Find user → Change role to ADMIN
```

---

## ⚙️ Cloudinary Setup

1. **Get Credentials:**
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Copy: Cloud Name, API Key, API Secret
   - Add to Vercel environment variables

2. **Test Upload:**
   - Try uploading an image after deployment
   - Check Cloudinary Media Library → `afh/artworks/` folder

---

## 🐛 What Still Needs Work (Optional Improvements)

### Priority: Medium
1. **Homepage Carousel UX**
   - Remove left/right arrows (keep dots pagination)
   - Fix carousel flow (no blank canvas at end)
   - Add hover effects on image cards

2. **User Profile Page**  
   - Replace mock artwork with real user artwork
   - Add ability to edit profile info

3. **Search & Filters**
   - Make search bar functional
   - Implement filter buttons (currently decorative)

### Priority: Low
4. **Admin Dashboard UI Polish**
   - Change background to white (currently light gray)  
   - Add edit modal UI for artwork details
   - Add reassign modal UI to select user

5. **Guest Upload Flow**
   - Add redirect to login/signup after upload
   - Show message: "Create account to see your artwork featured"

6. **Notifications**
   - Email notifications for approved/rejected artwork
   - Admin notifications for new submissions

---

## 📝 Testing Checklist Before Going Live

- [ ] Can users sign up?
- [ ] Can users log in?
- [ ] Can logged-in users upload artwork?
- [ ] Can guests upload artwork?
- [ ] Does navbar show correct links based on auth state?
- [ ] Can admins access admin dashboard?
- [ ] Can admins approve/reject artwork?
- [ ] Do approved artworks appear on homepage?
- [ ] Do images load from Cloudinary?
- [ ] Is the site mobile-responsive?

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Locally test the build
npm run build

# Check for TypeScript errors
npm run type-check
```

### Database Connection Issues
- Verify `DATABASE_URL` in Vercel matches Neon
- Check Neon database isn't in sleep mode
- Run migrations: `npx prisma migrate deploy`

### Images Not Loading
- Check Cloudinary credentials in Vercel
- Verify `next.config.js` has Cloudinary domain
- Check browser console for image errors

### Admin Can't Access Dashboard
- Verify user role is set to 'ADMIN' in database
- Check session is working (inspect cookies)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Check Neon database is accessible
4. Verify all environment variables are set

---

## 🎉 You're Ready to Deploy!

The core MVP is **complete** and **deployable**. Follow the steps above, and you should have a working beta site within 30 minutes!

**Last sync:** March 7, 2026 - All critical features implemented ✅
