const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtppro.zoho.com',
  port: parseInt(process.env.SMTP_PORT, 10) || 465,
  secure: process.env.SMTP_SECURE === 'true' || true,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
  }
});

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
  if (!studentEmail) {
    console.warn('Skipping graduation email: No email address provided.');
    return;
  }

  const mailOptions = {
    from: process.env.MAIL_FROM || `"Brand Monk Academy" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: '🎓 Welcome to the 24th Graduation Function - Brand Monk Academy',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://brandmonkacademy.com/wp-content/uploads/2023/09/cropped-BMA-Logo-01-01-768x228-1.png" alt="Brand Monk Academy" style="max-width: 200px; height: auto;" />
        </div>
        <h2 style="color: #4D1010; text-align: center;">Welcome, ${studentName}!</h2>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We are delighted to welcome you to the <strong>24th Graduation Function</strong> of Brand Monk Academy. This is a momentous occasion as we celebrate the achievements of our graduating students.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          As part of the celebrations, we cordially invite you to the <strong>Kuthu Vilakku Ceremony</strong> — a traditional lamp-lighting ceremony symbolizing knowledge, prosperity, and new beginnings.
        </p>
        <div style="background: #f9f3e6; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <h3 style="color: #4D1010; margin: 0 0 10px 0;">📄 Your Boarding Pass</h3>
          <p style="font-size: 14px; color: #555; margin: 0; line-height: 1.6;">
            Your boarding pass for the graduation function is ready. Please click the link below to access the event portal and view your ceremony details.
          </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://events.brandmonkacademy.com/" style="background-color: #D4AF37; color: white; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px; display: inline-block;">Access Event Portal</a>
        </div>
        <p style="font-size: 14px; color: #666; line-height: 1.6;">
          If the button above does not work, please copy and paste the following link into your browser:<br/>
          <a href="https://events.brandmonkacademy.com/" style="color: #D4AF37;">https://events.brandmonkacademy.com/</a>
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
    console.log(`Graduation email successfully sent to ${studentEmail}. MessageId: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send graduation email to ${studentEmail}:`, error);
  }
};

module.exports = { sendWelcomeEmail, sendGraduationEmail };
