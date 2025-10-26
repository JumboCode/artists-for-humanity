// app/api/admin/artworks/[id]/route.ts
// 
// THIS IS THE NEW 'app' ROUTER SYNTAX
//
import { NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// This function will now handle your GET /api/admin/artworks/1 request
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Your print statement will now work!

  const { id } = await params
  console.log('HIT THE GET ENDPOINT. ID:', id);

  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID.


  return NextResponse.json({});
}

// This handles the PATCH /api/admin/artworks/:id endpoint
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params
  console.log('HIT THE GET ENDPOINT. ID:', id);
  // const adminId = "GET_FROM_SESSION_MIDDLEWARE";

  // TASK FOR DEV:
  // 1. This is the "super edit" for admins.
  // 2. Get editable fields from req.body (e.g., title, description, featured).
  // const body = await req.json();
  // 3. Update the artwork.
  // 4. Log this action in AdminAction (e.g., 'ARTWORK_EDITED', 'ARTWORK_FEATURED')

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}

// You can add other methods (POST, DELETE) here as needed
// export async function DELETE(...) {}