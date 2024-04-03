const nodemailer = require('nodemailer');
require('dotenv').config();

const send_email = async (to, data) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: to,
            subject: data.subject,
            text: data.body,
        };

        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        throw err;
    }
}

module.exports = send_email;