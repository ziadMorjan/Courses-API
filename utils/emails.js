const nodemailer = require("nodemailer");

let sendResetPasswordEmail = async function (details) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: details.from,
        to: details.to,
        subject: details.subject,
        text: details.message
    });
}

module.exports = {
    sendResetPasswordEmail
}