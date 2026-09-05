const nodemailer = require('nodemailer');

const FROM_EMAIL = process.env.SMTP_FROM || 'education@brandmonkacademy.com';

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#039;');

const getTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendGraduationEmail = async ({ to, studentName, boardingPassUrl }) => {
  if (!to) {
    return { success: false, error: 'Student email is required.' };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      error: 'SMTP is not configured. Set SMTP_USER and SMTP_PASS on the server.'
    };
  }

  const safeName = escapeHtml(studentName || 'Student');
  const link = boardingPassUrl
    ? `<p style="margin:24px 0 0"><a href="${escapeHtml(boardingPassUrl)}" style="display:inline-block;background:#d4af37;color:#4d1010;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:700">Open Boarding Pass</a></p>`
    : '';

  try {
    const result = await transporter.sendMail({
      from: `Brand Monk Academy <${FROM_EMAIL}>`,
      to,
      subject: '🎓 24th Graduation Day – Registration Confirmed',
      text: `Dear ${studentName || 'Student'},\n\nGreetings from Brand Monk Academy!\n\nYour registration for the 24th Graduation Day has been successfully completed.\n\nYour Boarding Pass and Student Guidelines are attached with this email. Kindly go through them and keep your Boarding Pass ready for the event.\n\nWe look forward to celebrating this special day with you!\n\nWarm Regards,\nBrand Monk Academy\nGrowth Assured`,
      html: `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#3d2b1f;line-height:1.6"><p>Dear ${safeName},</p><p>Greetings from Brand Monk Academy!</p><p>Your registration for the <strong>24th Graduation Day</strong> has been successfully completed. 🎓</p><p>Your Boarding Pass and Student Guidelines are attached with this email. Kindly go through them and keep your Boarding Pass ready for the event.</p>${link}<p>We look forward to celebrating this special day with you!</p><p>Warm Regards,<br><strong>Brand Monk Academy</strong><br>Growth Assured</p></body></html>`
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('[Email] Graduation email failed:', error.message);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = sendGraduationEmail;
const verifyEmailTransport = async () => {
  const transporter = getTransporter();
  if (!transporter) return false;

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('[Email] SMTP verification failed:', error.message);
    return false;
  }
};

module.exports = { sendWelcomeEmail, sendGraduationEmail, verifyEmailTransport };
