const nodemailer = require("nodemailer");


const mailSender = async(email, title, body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
            secure: (process.env.MAIL_SECURE === 'true') || false,
            requireTLS: true,
            connectionTimeout: process.env.MAIL_CONNECTION_TIMEOUT ? parseInt(process.env.MAIL_CONNECTION_TIMEOUT, 10) : 10000,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        let info = await transporter.sendMail({
            from : "StudyNotion || Nextian  - by Singh",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })

        
        console.log(info);
        return info;
    }
    catch(error){
        console.error('MailSender error:', error);
        throw error;
    }
}


module.exports = mailSender;