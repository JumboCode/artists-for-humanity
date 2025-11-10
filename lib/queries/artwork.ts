// app/actions.ts
'use server'
import { neon } from '@neondatabase/serverless'
import { Artwork } from './types'

export async function getArtworkById(id: string): Promise<Artwork[]> {
  const sql = neon(process.env.DATABASE_URL as string)
  const resp = await sql`SELECT * FROM "Artwork" WHERE id = ${id}`
  return resp.map(
    (row): Artwork => ({
      id: row.id,
      title: row.title,
      description: row.description,
      tools_used: row.tools_used,
      project_type: row.project_type,
      image_url: row.image_url,
      thumbnail_url: row.thumbnail_url,
      status: row.status,
      submitted_by_name: row.submitted_by_name,
      submitted_by_email: row.submitted_by_email,
      rejection_reason: row.rejection_reason,
      featured: row.featured,
      view_count: row.view_count,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      approved_at: row.approved_at ? new Date(row.approved_at) : null,
      user_id: row.user_id,
      approved_by_id: row.approved_by_id,
    })
  )
}

export async function deleteArtworkById(id: string): Promise<Artwork[]>{
  const sql = neon(process.env.DATABASE_URL as string)
  const resp = await sql`DELETE FROM "Artwork" WHERE id = ${id}`
  return resp.map(
    (row): Artwork => ({
      id: row.id,
      title: row.title,
      description: row.description,
      tools_used: row.tools_used,
      project_type: row.project_type,
      image_url: row.image_url,
      thumbnail_url: row.thumbnail_url,
      status: row.status,
      submitted_by_name: row.submitted_by_name,
      submitted_by_email: row.submitted_by_email,
      rejection_reason: row.rejection_reason,
      featured: row.featured,
      view_count: row.view_count,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      approved_at: row.approved_at ? new Date(row.approved_at) : null,
      user_id: row.user_id,
      approved_by_id: row.approved_by_id,
    })
  )
  
}

export async function updateArtworkById(id: string) {}
