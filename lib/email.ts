import nodemailer from 'nodemailer'

const FROM_ADDRESS =
  process.env.EMAIL_FROM || 'Artists for Humanity <afh.digital.art@gmail.com>'

function resolveSmtpUser(fromAddress: string): string {
  // Prefer the email inside angle brackets if present, e.g. "Name <user@example.com>".
  // This regex is non-greedy and tolerant of accidental trailing characters.
  const bracketMatch = fromAddress.match(/<([^>]+)>/)
  if (bracketMatch?.[1]) {
    return bracketMatch[1].trim()
  }

  return fromAddress.trim()
}

function createTransport() {
  const smtpUser = process.env.SMTP_USER?.trim() || resolveSmtpUser(FROM_ADDRESS)

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtpUser,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string,
): Promise<void> {
  if (!process.env.GMAIL_APP_PASSWORD) {
    // Development fallback: log instead of sending
    console.info('[email] GMAIL_APP_PASSWORD not set — skipping send.')
    console.info('[email] Password reset URL:', resetUrl)
    return
  }

  const transporter = createTransport()

  await transporter.sendMail({
    from: FROM_ADDRESS,
    to: toEmail,
    subject: 'Reset your Artists for Humanity password',
    html: passwordResetHtml(resetUrl),
    text: passwordResetText(resetUrl),
  })
}

// ─── HTML template ────────────────────────────────────────────────────────────

function passwordResetHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:560px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1a1a1a;padding:28px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">
                Artists&nbsp;for&nbsp;Humanity
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Reset your password</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
                We received a request to reset the password for your AFH account.
                Click the button below to choose a new password. This link expires in
                <strong>30&nbsp;minutes</strong>.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:6px;background:#f59e0b;">
                    <a href="${escapeHtmlAttr(resetUrl)}"
                       style="display:inline-block;padding:14px 28px;color:#1a1a1a;font-size:15px;
                              font-weight:bold;text-decoration:none;border-radius:6px;">
                      Reset&nbsp;Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">
                If you didn't request a password reset, you can safely ignore this email —
                your password will not be changed.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
                Or paste this URL into your browser:<br />
                <span style="color:#6b7280;word-break:break-all;">${escapeHtml(resetUrl)}</span>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Artists for Humanity. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function passwordResetText(resetUrl: string): string {
  return [
    'Artists for Humanity — Reset your password',
    '',
    'We received a request to reset the password for your AFH account.',
    'Click the link below to choose a new password (expires in 30 minutes):',
    '',
    resetUrl,
    '',
    "If you didn't request this, ignore this email — your password won't change.",
  ].join('\n')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeHtmlAttr(str: string): string {
  return escapeHtml(str)
}
