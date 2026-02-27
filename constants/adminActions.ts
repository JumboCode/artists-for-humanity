// constants/adminActions.ts
export const ADMIN_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  REASSIGN: 'reassign',
  EDIT: 'edit',
  FEATURE: 'feature',
  UNFEATURE: 'unfeature',
  DELETE: 'delete',
} as const

export type AdminActionType = (typeof ADMIN_ACTIONS)[keyof typeof ADMIN_ACTIONS]

// Metadata structures for each action type
export interface AdminActionMetadata {
  approve: {
    previous_status: 'pending' | 'rejected'
    notification_sent: boolean
    approved_for_public: boolean
  }

  reject: {
    reason: string
    previous_status: 'pending' | 'approved'
    notification_sent: boolean
  }

  reassign: {
    from_user_id: string | null
    to_user_id: string
    from_user_email?: string
    to_user_email?: string
  }

  edit: {
    changes: {
      title?: { old: string; new: string }
      description?: { old: string; new: string }
      tools_used?: { old: string[]; new: string[] }
      project_type?: { old: string; new: string }
    }
  }
}
