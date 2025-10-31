export type Artwork = {
  id: string
  title: string
  description: string
  tools_used: string | null
  project_type: string
  image_url: string
  thumbnail_url: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  submitted_by_name: string
  submitted_by_email: string | null
  rejection_reason: string | null
  featured: boolean
  view_count: number
  created_at: Date
  updated_at: Date
  approved_at: Date | null
  user_id: string
  approved_by_id: string | null
}
