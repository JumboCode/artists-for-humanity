// utils/adminActionLogger.ts
import { prisma } from '@/lib/prisma';
import { admin_actions } from '@/constants/adminActions';

export async function logAdminAction<T extends AdminActionType>(
  adminId: string,
  actionType: T,
  artworkId: string,
  metadata: AdminActionMetadata[T]
) {
  return await db.insert(admin_actions).values({
    admin_id: adminId,
    action_type: actionType,
    artwork_id: artworkId,
    metadata: metadata as any, // JSONB field
    created_at: new Date()
  });
}

// Ready-to-use function for each action
export const adminActions = {
  async approve(adminId: string, artworkId: string, options?: Partial<AdminActionMetadata['approve']>) {
    const metadata: AdminActionMetadata['approve'] = {
      previous_status: 'pending',
      auto_featured: false,
      notification_sent: true,
      approved_for_public: true,
      ...options
    };
    
    await logAdminAction(adminId, ADMIN_ACTIONS.APPROVE, artworkId, metadata);
    // Send notification using template
    return NOTIFICATION_TEMPLATES.approve;
  },
  
  async reject(
    adminId: string, 
    artworkId: string, 
    reason: keyof typeof NOTIFICATION_TEMPLATES.reject.reasons,
    customFeedback?: string
  ) {
    const metadata: AdminActionMetadata['reject'] = {
      reason: NOTIFICATION_TEMPLATES.reject.reasons[reason],
      reason_category: reason === 'quality' ? 'quality' : reason as any,
      previous_status: 'pending',
      notification_sent: true,
      detailed_feedback: customFeedback
    };
    
    await logAdminAction(adminId, ADMIN_ACTIONS.REJECT, artworkId, metadata);
    return NOTIFICATION_TEMPLATES.reject;
  },  
};