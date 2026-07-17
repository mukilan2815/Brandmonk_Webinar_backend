const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo-bm.png');
const logoExists = fs.existsSync(LOGO_PATH);
if (!logoExists) {
  console.warn('[Email] Logo file not found at:', LOGO_PATH, '— falling back to remote URL');
}

const smtpHost = process.env.SMTP_HOST || 'smtppro.zoho.com';
const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 465;
const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  auth: {
    user: smtpUser,
    pass: smtpPass
  }
});

const FROM_EMAIL = process.env.MAIL_FROM || `Brand Monk Academy <${smtpUser || 'no-reply@brandmonkacademy.com'}>`;

console.log('[Email] SMTP configuration:', {
  host: smtpHost,
  port: smtpPort,
  secure: smtpSecure,
  userConfigured: Boolean(smtpUser),
  passwordConfigured: Boolean(smtpPass),
  from: FROM_EMAIL
});

const verifyEmailTransport = async () => {
  try {
    await transporter.verify();
    console.log('[Email] SMTP transport verified successfully. Emails can be sent.');
    return true;
  } catch (error) {
    console.error('[Email] SMTP transport verification failed:', error.message);
    return false;
  }
};

/**
 * Sends a welcome email to the registered student asynchronously.
 * This function handles errors internally to avoid blocking the registration flow.
 */
const sendWelcomeEmail = async (studentName, studentEmail, eventName) => {
  if (!studentEmail) {
    console.warn('Skipping email: No email address provided.');
    return;
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || `"Brand Monk Academy" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'Welcome to Brand Monk Academy - Kuthuvilakku Ceremony Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" alt="Brand Monk Academy" style="max-width: 200px; height: auto;" />
        </div>
        <h2 style="color: #4D1010; text-align: center;">Welcome, ${studentName}!</h2>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Thank you for registering for the <strong>${eventName || 'Graduation Function'}</strong> at Brand Monk Academy. We are excited to have you celebrate this milestone with us!
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          To commemorate this auspicious beginning, we invite you to participate in the virtual <strong>Kuthuvilakku Ceremony</strong>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://instastory-bma.vercel.app/" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px; display: inline-block;">Join Kuthuvilakku Ceremony</a>
        </div>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If the button above does not work, please copy and paste the following link into your browser: <br/>
          <a href="https://instastory-bma.vercel.app/" style="color: #D4AF37;">https://instastory-bma.vercel.app/</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          © 2026 Brand Monk Academy. All rights reserved.
        </p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email successfully sent to ${studentEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send welcome email to ${studentEmail}:`, error);
  }
};

const sendGraduationEmail = async (studentName, studentEmail) => {
  const recipient = (studentEmail || '').trim().toLowerCase();
  console.log('[GraduationEmail] Send requested:', {
    studentName,
    recipient: recipient || 'missing',
    smtpHost,
    smtpPort,
    smtpSecure
  });

  if (!recipient) {
    console.warn('[GraduationEmail] Skipped: no email address provided.');
    return { success: false, error: 'No email address provided' };
  }

  const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoExists ? 'cid:logo-bm' : 'https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png'}" alt="Brand Monk Academy" style="max-width: 200px; height: auto;" />
        </div>
        <h2 style="color: #4D1010; text-align: center;">Welcome, ${studentName}!</h2>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We are delighted to welcome you to the <strong>24th Graduation Function</strong> of Brand Monk Academy. This is a momentous occasion as we celebrate the achievements of our graduating students.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          As part of the celebrations, we cordially invite you to the <strong>Kuthu Vilakku Ceremony</strong> — a traditional lamp-lighting ceremony symbolizing knowledge, prosperity, and new beginnings.
        </p>
        <div style="background: #f9f3e6; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #4D1010; margin: 0 0 10px 0;">🪔 Kuthuvilakku Ceremony</h3>
          <p style="font-size: 14px; color: #555; margin: 0; line-height: 1.6;">
            Click the link below to join the Kuthuvilakku Ceremony and view the event details.
          </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://events.brandmonkacademy.com/light" style="background-color: #D4AF37; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px; display: inline-block;">Join Kuthuvilakku Ceremony</a>
        </div>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If the button above does not work, please copy and paste the following link into your browser:<br/>
          <a href="https://events.brandmonkacademy.com/light" style="color: #D4AF37;">https://events.brandmonkacademy.com/light</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999; text-align: center;">
          © 2026 Brand Monk Academy. All rights reserved.
        </p>
      </div>
    `;

  try {
    const mailConfig = {
      from: FROM_EMAIL,
      to: recipient,
      subject: '🪔 Kuthuvilakku Ceremony - 24th Graduation Function | Brand Monk Academy',
      html: emailHtml
    };

    if (logoExists) {
      mailConfig.attachments = [{ filename: 'logo-bm.png', path: LOGO_PATH, cid: 'logo-bm' }];
    }

    const info = await transporter.sendMail(mailConfig);
    console.log('[GraduationEmail] SMTP accepted message:', {
      recipient,
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    return { success: true, messageId: info.messageId, response: info.response };
  } catch (error) {
    console.error('[GraduationEmail] SMTP send failed:', {
      recipient,
      code: error.code,
      command: error.command,
      response: error.response,
      message: error.message
    });
    return { success: false, error: error.message, code: error.code, response: error.response };
  }
};

module.exports = { sendWelcomeEmail, sendGraduationEmail, verifyEmailTransport };
