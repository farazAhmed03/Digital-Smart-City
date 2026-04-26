import nodemailer from 'nodemailer';

const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 465;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        console.warn('⚠️ WARNING: SMTP credentials are missing. Email services may be unavailable.');
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port == 465, // true for 465, false for other ports
        auth: {
            user,
            pass,
        },
    });
};

const transporter = createTransporter();

export const sendEmail = async ({ to, subject, html }) => {
    if (!transporter) {
        console.error('❌ Email not sent: Transporter is not initialized (missing credentials).');
        return false;
    }

    try {
        console.log(`Attempting to send email to ${to} via SMTP...`);
        
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Digital Kohat" <noreply@digitalkohat.com>',
            to,
            subject,
            html
        });

        console.log(`Email sent successfully: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ SMTP Exception:', error.message);
        return false;
    }
};
