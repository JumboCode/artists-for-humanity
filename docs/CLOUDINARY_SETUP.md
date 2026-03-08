# Cloudinary Setup for Profile Picture Uploads

## Overview
Profile picture uploads use Cloudinary's unsigned upload feature for client-side uploads without exposing API secrets.

## Setup Instructions

### 1. Create an Unsigned Upload Preset

1. Go to your [Cloudinary Console](https://cloudinary.com/console)
2. Navigate to **Settings** → **Upload**
3. Scroll to **Upload presets**
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `afh-unsigned`
   - **Signing mode**: **Unsigned**
   - **Folder**: `profile-images` (optional but recommended)
   - **Use filename**: No (recommended for security)
   - **Unique filename**: Yes (recommended)
   - **Overwrite**: No (recommended)
   - **Allowed formats**: `jpg,png,gif,webp` (recommended)
   - **Max file size**: 10485760 (10MB in bytes)
   - **Resource type**: Image
6. Click **Save**

### 2. Environment Variables

The following environment variables are required in your `.env.local` file:

```env
# Server-side (already configured)
CLOUDINARY_CLOUD_NAME="dzqbeenus"
CLOUDINARY_API_KEY="541194484279721"
CLOUDINARY_API_SECRET="mRDz9jwsAzGo0xIQw3qt8i5nFFY"

# Client-side (for browser uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dzqbeenus"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="afh-unsigned"
```

**Important**: Make sure the `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` matches the preset name you created in Cloudinary.

### 3. Security Considerations

- **Unsigned uploads** allow uploads without authentication, so:
  - Set max file size limits in the preset (recommended: 10MB)
  - Restrict to image formats only
  - Consider enabling Cloudinary's moderation features
  - Set folder access restrictions if needed

- **Never expose** `CLOUDINARY_API_SECRET` to the client
- Only `NEXT_PUBLIC_*` variables are accessible in browser code

### 4. Usage in Application

Profile pictures are uploaded:
- When users edit their profile via the "Edit Profile Info" modal
- Images are stored in the `profile-images` folder in Cloudinary
- URLs are saved to the `profile_image_url` field in the database
- Both users and admins can upload profile pictures

### 5. Testing

1. Log in to your account
2. Go to your profile page
3. Click "Edit Profile Info"
4. Click "Upload Profile Picture"
5. Select an image (max 10MB, JPG/PNG/GIF)
6. The image should upload and display a preview
7. Click "Save Changes" to persist the change

### 6. Troubleshooting

**Upload fails with "Unauthorized"**:
- Verify the upload preset exists and is set to "Unsigned"
- Check that `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` matches the preset name

**Upload fails with "Invalid"**:
- Check file size (must be under 10MB)
- Check file format (must be an image type)
- Verify Cloudinary cloud name is correct

**Image doesn't display**:
- Check browser console for CORS errors
- Verify Cloudinary URL is publicly accessible
- Clear Next.js cache and restart dev server

**Environment variables not working**:
- Restart the Next.js dev server after changing `.env.local`
- Variables with `NEXT_PUBLIC_` prefix must be set at build time
- Don't use quotes in terminal when testing with `echo $NEXT_PUBLIC_*`

## Alternative: Signed Uploads

If you prefer signed uploads for additional security, you'll need to:
1. Create a server-side API endpoint that generates upload signatures
2. Modify the upload handler to request a signature first
3. Include the signature in the upload request

This is more secure but adds complexity. For profile pictures, unsigned uploads with proper validations are typically sufficient.
