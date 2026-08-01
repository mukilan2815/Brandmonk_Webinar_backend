const emailDisabledResult = {
  success: false,
  disabled: true,
  error: 'Email delivery is disabled.'
};

const sendWelcomeEmail = async () => emailDisabledResult;
const sendGraduationEmail = async () => emailDisabledResult;
const verifyEmailTransport = async () => false;

module.exports = { sendWelcomeEmail, sendGraduationEmail, verifyEmailTransport };
