const sgMail = require("@sendgrid/mail");

const mailSender = async (email, title, body) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "My EdTech Platform By Vinod Jangra",
      },
      subject: title,
      html: body,
    };

    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error("SendGrid Error:", error.response?.body || error);
    throw error;
  }
};

module.exports = mailSender;
