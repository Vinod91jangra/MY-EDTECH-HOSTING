const sgMail = require('@sendgrid/mail');

const mailSender = async (email, title, body) => {
  // If SendGrid is available and configured, use it
  if (sgMail && process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: process.env.MAIL_FROM_NAME || "My EdTech Platform",
        },
        subject: title,
        html: body,
      };

      const response = await sgMail.send(msg);
      console.log('SendGrid send result:', response && response[0]);
      return response;
    } catch (error) {
      console.error("SendGrid Error:", error.response?.body || error);
      // fallthrough to try Brevo if available
    }
  }

  // Fallback to Brevo SMTP API via HTTP
  const brevoKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  if (brevoKey) {
    try {
      const payload = {
        sender: { name: process.env.MAIL_FROM_NAME || 'My EdTech Platform', email: process.env.MAIL_USER || process.env.SENDGRID_FROM_EMAIL || 'no-reply@study-notion.example' },
        to: [{ email }],
        subject: title,
        htmlContent: body,
      };

      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': brevoKey,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (!res.ok) {
        const err = new Error(`Brevo API error: ${res.status} ${res.statusText} - ${text}`);
        err.status = res.status;
        throw err;
      }

      console.log('Brevo send result:', text);
      return JSON.parse(text);
    } catch (err) {
      console.error('Brevo send error:', err);
      throw err;
    }
  }

  // If neither method is available, throw explicit error
  const e = new Error('No mail provider configured. Install @sendgrid/mail or set BREVO_API_KEY.');
  console.error(e.message);
  throw e;
};

module.exports = mailSender;
