// constants/adminNotifications.ts
export const NOTIFICATION_TEMPLATES = {
  approve: {
    subject: 'Your artwork has been approved!',
    message: (title: string) =>
      `Great news! Your artwork "${title}" has been approved and is now live on AFH Digital Archive.`,
    email_body: (title: string, url: string) =>
      `Your artwork "${title}" has been approved and is now visible to the public.\n\nView it here: ${url}\n\nThank you for contributing to AFH Digital Archive!`,
  },

  reject: {
    subject: 'Artwork submission update',
    message: (title: string, reason: string) =>
      `Your artwork "${title}" needs some adjustments: ${reason}`,
    email_body: (title: string, reason: string, feedback?: string) =>
      `Your artwork "${title}" was not approved at this time.\n\nReason: ${reason}\n${feedback ? `\nFeedback: ${feedback}` : ''}\n\nPlease feel free to make adjustments and resubmit.`,

    // Predefined rejection reasons
    reasons: {
      quality:
        'Image quality is too low. Please upload a higher resolution version.',
      inappropriate: "Content doesn't align with AFH community guidelines.",
      copyright:
        'Potential copyright concern. Please ensure all work is original.',
      duplicate: 'This artwork appears to be a duplicate submission.',
      incomplete: 'Submission is missing required information.',
      other: 'Please contact admin for specific feedback.',
    },
  },

  feature: {
    subject: 'Your artwork has been featured!',
    message: (title: string) =>
      `Congratulations! Your artwork "${title}" has been featured on the homepage.`,
    email_body: (title: string, category: string) =>
      `Exciting news! Your artwork "${title}" has been selected for our ${category}.\n\nThis means more visibility for your amazing work!`,
  },

  reassign: {
    subject: 'Artwork ownership updated',
    message: (title: string) =>
      `The artwork "${title}" has been assigned to your account.`,
    email_body: (title: string) =>
      `The artwork "${title}" has been successfully linked to your account.\n\nYou can now manage this artwork from your profile.`,
  },
}
