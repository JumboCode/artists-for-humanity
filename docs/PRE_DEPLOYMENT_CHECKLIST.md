# AFH Digital Portfolio - Pre-Deployment Testing Checklist

## 🎯 Core Demo Flow Testing

### 1. Guest Upload Flow ✅
- [ ] Navigate to `/upload` without logging in
- [ ] Fill out guest upload form (name, email, artwork details)
- [ ] Select and upload an image file
- [ ] Submit artwork successfully
- [ ] Verify success message appears with "Create Account" CTA
- [ ] Confirm 30-second countdown timer displays
- [ ] Verify artwork is stored with `submitted_by_email` and `submitted_by_name`

### 2. User Registration & Auto-Claim ✅
- [ ] Click "Create Account" from guest upload success page
- [ ] Navigate to `/sign-up`
- [ ] Fill registration form with **same email** used in guest upload
- [ ] Submit registration successfully
- [ ] Verify auto-login after signup
- [ ] **NEW:** Confirm ClaimArtworkModal appears showing guest uploads
- [ ] Click "Claim My Artwork" button
- [ ] Verify artwork is now linked to user account
- [ ] Check user portal shows claimed artwork

### 3. User Login Flow
- [ ] Navigate to `/login`
- [ ] Enter valid credentials
- [ ] Verify successful login
- [ ] Redirect to appropriate page (user portal or homepage)
- [ ] Verify session persists on page refresh
- [ ] Check navbar shows profile dropdown

### 4. User Profile & Portal 🔧 NEEDS FIXES
**Current Issues:**
- Profile page uses hardcoded mock data
- Edit profile button doesn't persist changes to database
- Upload buttons are non-functional
- Bio information not displaying from actual user data

**Testing After Fixes:**
- [ ] Navigate to `/user-page` (profile view)
- [ ] Verify user's actual name, bio, and info displays (from database)
- [ ] Click "Edit Profile Info" button
- [ ] Update profile information (name, bio, school, etc.)
- [ ] Save changes
- [ ] Confirm changes persist after page reload
- [ ] Navigate to `/user-portal`
- [ ] Verify "Published" tab shows approved artwork
- [ ] Verify "Drafts" tab shows pending/rejected artwork
- [ ] Click "Upload a New Project" button
- [ ] Verify redirects to `/upload` page

### 5. Artwork Upload (Authenticated User)
- [ ] Login as user
- [ ] Navigate to `/upload`
- [ ] Fill artwork details form
- [ ] Upload an image file (test various sizes)
- [ ] Verify Cloudinary upload works
- [ ] Submit successfully
- [ ] Artwork status should be PENDING
- [ ] User should see artwork in "Drafts" section of portal

### 6. Admin Dashboard - Review Queue
- [ ] Login as admin user
- [ ] Navigate to `/admin`
- [ ] Verify pending artwork queue displays
- [ ] Each card shows:
  - Artwork image thumbnail
  - Title and description
  - Artist name (or guest name)
  - Tools used
  - Submission date
- [ ] Test "Approve" button on artwork
- [ ] Test "Reject" button with reason modal
- [ ] Verify actions update artwork status
- [ ] Confirm AdminAction logs are created

### 7. Admin Homepage Controls 🆕 NEEDS IMPLEMENTATION
**Feature Request:**
- Admin views homepage `/`
- Approved artwork in gallery should show admin-only controls:
  - ❌ **Delete button** - Remove artwork from site
  - ⭐ **Feature to Carousel** - Toggle featured status
- Controls should overlay on hover or be visible buttons

**Testing After Implementation:**
- [ ] Login as admin
- [ ] Navigate to homepage `/`
- [ ] Hover over approved artwork in gallery
- [ ] Verify admin-only buttons appear (delete, feature)
- [ ] Click "Feature to Carousel" button
- [ ] Confirm artwork appears in top carousel
- [ ] Click "Unfeature" button
- [ ] Confirm artwork removed from carousel
- [ ] Click "Delete" button
- [ ] Confirm deletion modal appears
- [ ] Delete artwork
- [ ] Verify artwork removed from homepage

### 8. Homepage Gallery - Public View
- [ ] Visit homepage `/` without logging in
- [ ] Verify carousel shows **featured** artwork only
- [ ] Scroll to gallery (Masonry layout)
- [ ] Verify all **approved** artwork displays
- [ ] Test search functionality
  - Search by artist name
  - Search by artwork title
  - Search by medium
- [ ] Test filter by medium (top filter buttons)
- [ ] Verify results update correctly
- [ ] Click artwork should show details (if implemented)

### 9. Featured Artwork & Collections 🆕 NEEDS IMPLEMENTATION
**Feature Request:**
- When admin approves artwork, automatically add to collection based on medium
- Mediums stored in `tools_used` array field
- Homepage carousel filters by `featured: true`

**Database Schema Check:**
- [ ] Verify `Artwork.featured` boolean field exists
- [ ] Verify `Artwork.tools_used` array field exists
- [ ] Check if Collection model exists (may need to create)

**Testing After Implementation:**
- [ ] Admin approves artwork with medium "Digital Art"
- [ ] Verify artwork can be featured
- [ ] Navigate to homepage
- [ ] Featured artwork appears in carousel
- [ ] Artwork also appears in "Digital Art" collection (if implemented)

### 10. Admin Navbar Changes 🆕 NEEDS IMPLEMENTATION
**Feature Request:**
- Remove "Upload My Work" link from navbar when admin is logged in
- Admins shouldn't upload artwork through the normal flow

**Testing After Implementation:**
- [ ] Login as admin user
- [ ] Check navbar - "Upload My Work" link should NOT appear
- [ ] Login as regular student user
- [ ] Check navbar - "Upload My Work" link SHOULD appear
- [ ] Logout
- [ ] Guest view - "Upload My Work" link SHOULD appear

---

## 🔧 Technical Issues to Fix

### Priority 1: Critical for Demo
1. **Profile Page Data Integration**
   - Connect `/user-page` to real user data from session
   - Load user's actual profile information (name, bio, school, etc.)
   - Display user's actual artwork (query by user_id)

2. **Edit Profile Functionality**
   - Create/update API endpoint: `PATCH /api/users/profile`
   - Save profile updates to database
   - Update session data after profile changes

3. **Upload Button Functionality**
   - All "Upload" buttons should navigate to `/upload`
   - Verify upload page works for authenticated users
   - Ensure artwork links to user_id correctly

4. **Admin Navbar Conditional**
   - Hide "Upload My Work" link when `session.user.role === 'ADMIN'`
   - Update `app/components/Navbar.tsx`

5. **Admin Homepage Controls**
   - Create admin-only UI controls on homepage gallery
   - Implement delete artwork endpoint: `DELETE /api/admin/artworks/[id]`
   - Add feature/unfeature button on homepage (already has endpoint)
   - Show controls only when admin is logged in

### Priority 2: Nice to Have
6. **Featured Artwork in Carousel**
   - Update homepage to query only `featured: true` for carousel
   - Ensure non-featured approved artwork still shows in gallery

7. **Collections by Medium** (Future Enhancement)
   - Create Collection model if needed
   - Link artwork to collections based on `tools_used`
   - Create collection pages

8. **Email Notifications** (Post-MVP)
   - Send email on artwork approval
   - Send email on artwork rejection
   - Welcome email on signup

---

## 🔐 Authentication & Authorization Checklist

- [ ] Admin routes protected (`/admin/*`)
- [ ] User routes protected (`/user-portal`, `/user-page`)
- [ ] Non-authenticated users can upload as guest
- [ ] Session persists correctly
- [ ] Role-based access control works (ADMIN, STUDENT)

---

## 🗄️ Database & API Checklist

### Existing & Working:
- [x] User model (id, email, username, password_hash, role)
- [x] Profile model (display_name, bio, profile_image_url)
- [x] Artwork model (all fields including featured, submitted_by_email)
- [x] AdminAction logging model
- [x] Guest uploads with email capture
- [x] Auto-claim API endpoints (`/api/artworks/claim`)
- [x] Admin queue API (`/api/admin/queue`)
- [x] Admin approve/reject API (`/api/admin/artworks/[id]`)
- [x] Feature artwork API (`/api/admin/artworks/[id]/feature`)

### Need to Create:
- [ ] Profile update API (`PATCH /api/users/profile`)
- [ ] Delete artwork API (`DELETE /api/admin/artworks/[id]`)
- [ ] Get user artwork API (`GET /api/users/[username]/artworks`)
- [ ] Featured artwork filter in homepage API

---

## 🎨 UI/UX Polish Checklist

- [ ] All images load correctly (Cloudinary + local fallbacks)
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Loading states show during API calls
- [ ] Error messages display clearly
- [ ] Success messages confirm actions
- [ ] Forms validate input before submission
- [ ] Buttons have hover states
- [ ] Admin controls are clearly visible
- [ ] Guest upload success message is prominent

---

## 🚀 Deployment Readiness

### Environment Variables (Already Configured ✅)
- [x] `DATABASE_URL` - Neon PostgreSQL
- [x] `NEXTAUTH_SECRET` - Generated
- [x] `NEXTAUTH_URL` - Set for production
- [x] `CLOUDINARY_CLOUD_NAME`
- [x] `CLOUDINARY_API_KEY`
- [x] `CLOUDINARY_API_SECRET`

### Pre-Deploy Tasks
- [ ] Run `npm run build` successfully
- [ ] Fix all TypeScript errors
- [ ] Test production build locally
- [ ] Verify all API routes work in production mode
- [ ] Check database migrations are applied
- [ ] Confirm Cloudinary uploads work in production

### Post-Deploy Testing
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Upload functionality works
- [ ] Admin dashboard accessible
- [ ] All images load from Cloudinary

---

## 📋 Summary of Changes Needed

### Must Implement Before Demo:
1. ✅ Auto-claim modal for guest uploads (DONE)
2. 🔧 Connect user profile page to real database data
3. 🔧 Implement edit profile API endpoint
4. 🔧 Make all upload buttons functional (navigate to `/upload`)
5. 🆕 Hide "Upload My Work" from admin navbar
6. 🆕 Add admin delete button to homepage gallery
7. 🆕 Add admin feature button to homepage gallery (reuse existing API)
8. 🔧 Filter homepage carousel to show only featured artwork

### Can Wait for v2:
- Collections by medium
- Email notifications
- Advanced analytics
- Batch actions for admin

---

**Last Updated:** March 8, 2026
