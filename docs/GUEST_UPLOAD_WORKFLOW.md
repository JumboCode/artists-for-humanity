# Guest Upload & Assignment Workflow

## Overview

This document explains the recommended workflow for handling guest artwork submissions and encouraging account creation.

---

## Current Implementation ✅

### 1. **Guest Upload Flow (Low Friction)**
```
Guest visits /upload
  ↓
Fills form (no account required)
  ↓
Submits artwork with name + email
  ↓
Success message with "Create Account" prompt
  ↓
Artwork status: PENDING
```

**Why allow guest uploads?**
- Maximum engagement from students
- Low friction = more submissions
- Captures interest before asking for commitment

### 2. **Post-Upload Prompt**
After successful guest upload, we show:
- ✅ Success confirmation
- 📧 Review process explanation
- 🎯 **Call-to-action to create account**
- 💡 Benefits of having an account

**Benefits highlighted:**
- Build your portfolio
- Track your artwork status
- Get notifications when approved
- Have your name linked to your work

### 3. **Automatic Artwork Claiming** 🆕
When a user signs up or logs in, the system automatically:
1. Checks for guest uploads with matching email
2. Shows a modal with unclaimed artwork thumbnails
3. Allows one-click claiming to link artwork to account

**Implementation:**
- API endpoint: `GET /api/artworks/claim` - Check for unclaimed artwork
- API endpoint: `POST /api/artworks/claim` - Claim all matching artwork
- Modal component: `ClaimArtworkModal` - Shows on first login after signup
- Auto-triggers: Runs once per session when user authenticates

**User experience:**
```
User signs up with email
  ↓
Redirects to user portal
  ↓
Modal appears showing guest uploads
  ↓
User clicks "Claim My Artwork"
  ↓
Artwork instantly linked to account
  ↓
Modal closes, artwork visible in portfolio
```

### 4. **Admin Assignment Workflow**
Admins can handle guest uploads in two ways:

#### Option A: User Creates Account Later
```
Guest uploads → Admin approves → User creates account → Admin assigns artwork
```

1. Guest submits artwork (stored with `submitted_by_name` and `submitted_by_email`)
2. Admin reviews in `/admin` dashboard
3. Admin approves artwork (status: APPROVED)
4. Guest creates account using same email
5. Admin finds user by email
6. Admin assigns artwork to user's profile via **Reassign** feature

#### Option B: Edit Before Approval
```
Guest uploads → Admin edits details → Admin approves
```

1. Guest submits artwork
2. Admin reviews details
3. Admin corrects typos or updates metadata
4. Admin approves artwork
5. Artwork goes live attributed to guest name

---

## API Endpoints

### Claim Guest Artwork (Auto-Link)
```http
GET /api/artworks/claim
Authorization: NextAuth session required

Response:
{
  "count": 2,
  "artwork": [
    {
      "id": "artwork_123",
      "title": "My Artwork",
      "image_url": "https://...",
      "status": "PENDING",
      "created_at": "2026-03-08T..."
    }
  ]
}
```

**Use case:** Check if user has unclaimed guest uploads matching their email

```http
POST /api/artworks/claim
Authorization: NextAuth session required

Response:
{
  "success": true,
  "count": 2
}
```

**Use case:** Claim all guest uploads matching authenticated user's email

**Logic:**
- Finds all artwork where `submitted_by_email` matches `session.user.email`
- AND `user_id` is NULL (unclaimed)
- Updates `user_id` to current user's ID
- Returns count of claimed artwork

### Reassign Artwork to User (Admin Only)
```http
PATCH /api/admin/artworks/[id]/reassign
Content-Type: application/json

{
  "newUserId": "clxxx123456789"
}
```

**Use case:** Manually link guest artwork to specific user (admin override)

**Requirements:**
- Admin authentication
- Valid user ID exists
- Artwork exists

**Result:**
- Artwork `user_id` updated
- Action logged in `AdminAction` table
- User can now see artwork in their portfolio

---

## Recommended Admin Workflow

### Weekly Admin Review Process

1. **Go to Admin Dashboard** (`/admin`)
2. **Review Pending Queue**
   - Check guest submissions (shows name + email)
   - Verify artwork quality
   - Check for typos in title/description

3. **For Each Submission:**
   
   **If user has account:**
   - ✅ Approve immediately
   - Artwork appears in user's portfolio

   **If guest submission:**
   - Option 1: Approve as guest (shows submitted_by_name)
   - Option 2: Contact guest to create account, then assign
   
4. **Search for Matching Users**
   - Use email to find if guest created account
   - If found, use "Reassign" to link artwork

5. **Approve & Feature**
   - Approved artwork appears on homepage
   - Featured artwork gets carousel placement

---

## User Benefits Breakdown

### Without Account (Guest)
- ✅ Can submit artwork
- ✅ Artwork reviewed and approved
- ✅ Appears on homepage if approved
- ❌ No portfolio
- ❌ No approval notifications
- ❌ Can't track submissions
- ❌ Can't edit after submission

### With Account
- ✅ Everything above PLUS:
- ✅ Personal portfolio at `/user-portal`
- ✅ Track all submissions (draft/pending/approved)
- ✅ Edit profile and artwork details
- ✅ Receive notifications
- ✅ Build reputation over time
- ✅ Connect with other artists

---

## Database Schema

### Guest Upload Storage
```typescript
Artwork {
  id: string
  user_id: string?           // NULL for guest uploads
  submitted_by_name: string?  // Guest's name
  submitted_by_email: string? // Guest's email
  status: PENDING | APPROVED | REJECTED
  ...
}
```

### After Assignment
```typescript
Artwork {
  id: string
  user_id: "clxxx123"        // NOW LINKED to user
  submitted_by_name: null     // Cleared (optional)
  submitted_by_email: null    // Cleared (optional)
  status: APPROVED
  ...
}

AdminAction {
  action_type: "USER_EDITED"
  admin_id: "admin_id"
  artwork_id: "artwork_id"
  metadata: {
    oldUserId: null
    newUserId: "clxxx123"
    reassigned_at: "2026-03-08T..."
  }
}
```

---

## Email Templates (Future Enhancement)

### After Guest Upload
```
Subject: Your Artwork Has Been Submitted! 🎨

Hi [Name],

Thanks for submitting "[Artwork Title]" to Artists for Humanity!

Your artwork is under review by our team. Here's what happens next:

✓ Review (1-3 days)
✓ Approval
✓ Featured on AFH Digital Portfolio

Want to track your artwork and build your portfolio?

[Create Your Free Account] → Use this email: [email]

Once you create an account with this email, we'll link your approved 
artwork to your profile automatically.

Questions? Reply to this email.

- AFH Team
```

### After Approval (Guest)
```
Subject: Your Artwork is Live! 🎉

Hi [Name],

Great news! "[Artwork Title]" has been approved and is now featured
on the AFH Digital Portfolio!

View it here: [link to homepage]

Ready to build your portfolio?

[Create Your Account] → We'll link all your approved artwork

- AFH Team
```

---

## Best Practices

### For Admins
1. ✅ **Check email before approving guest work** - User might have account
2. ✅ **Use search to find existing users** - Avoid duplicate profiles
3. ✅ **Proofread guest submissions** - Fix typos before approval
4. ✅ **Contact frequent submitters** - Encourage account creation
5. ✅ **Use reassign feature liberally** - Better to link than leave as guest

### For Development
1. ✅ **Keep guest uploads enabled** - Maximizes submissions
2. ✅ **Prominent CTA after upload** - Drives account creation
3. ✅ **Email notifications** - Reminds guests to create accounts
4. ✅ **Allow email-based claim** - Easy linking process
5. ✅ **Auto-suggest matches** - Admin sees "potential match" if email exists

---

## Metrics to Track

Monitor these to optimize the flow:
- **Guest upload rate** vs **Registered user uploads**
- **Guest → Account conversion rate**
- **Time between upload and account creation**
- **Reassignment frequency**
- **Abandoned guest artwork** (never claimed)

---

## Future Enhancements

### Phase 2: Email Verification
- Guest uploads with email
- Email sent with verification link
- Link allows claiming artwork when creating account

### Phase 3: Automatic Matching ✅ IMPLEMENTED
- ✅ When user signs up, check for guest uploads with same email
- ✅ Prompt: "We found 2 artworks you submitted. Claim them?"
- ✅ One-click assignment
- **Status:** Live in production via ClaimArtworkModal component

### Phase 4: Guest Portal
- Temporary access code sent to email
- View submission status without account
- Easy upgrade to full account

---

## Decision: Keep Guest Uploads ✅

**Rationale:**
1. **Lowers barrier to entry** - Students submit without commitment
2. **Admin has flexibility** - Can assign later if user creates account
3. **Data capture** - We have email for follow-up
4. **Conversion funnel** - Success message drives signups
5. **Real-world alignment** - Many students want to "try before commit"

**Alternative rejected:**
❌ Require account before upload
- Would reduce submissions
- Adds friction at wrong point
- Loses casual submitters

---

## Summary

**Current flow is optimal:**
1. ✅ Guest can upload (low friction)
2. ✅ Post-upload prompt to create account (conversion opportunity)
3. ✅ **Auto-claim feature links guest uploads when user signs up** (seamless experience)
4. ✅ Admin can approve as guest OR manually reassign (flexibility)
5. ✅ Email capture enables automatic matching

**Recent updates:**
- ✅ **Automatic artwork claiming** - Users see modal on first login to claim guest submissions
- ✅ **API endpoints** - `/api/artworks/claim` for checking and claiming unclaimed artwork
- ✅ **ClaimArtworkModal component** - Beautiful UI for claiming process
- ✅ **Email-based matching** - Zero friction claiming experience

**Last Updated:** March 8, 2026 (Auto-claim feature added)
