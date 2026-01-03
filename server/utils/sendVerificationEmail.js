const mailSender = require("./MailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const sendVerificationEmail = async (email, otp) => {
  try {
    await mailSender(
      email,
      "Verification Email from MY-EDTECH-PLATFORM",
      emailTemplate(otp)
    );
  } catch (error) {
    console.error("Verification email failed:", error);
  }
};

module.exports = sendVerificationEmail;
