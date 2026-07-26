import { sendEmail } from "../../utils/emailSender.js";

export const ContactUsController = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, subject, message } = req.body;

        if (!firstName || !lastName || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // 1. Send Notification Email to Admin
        const adminEmail = process.env.CONTACT_EMAIL || "digitalsmartcities@gmail.com";
        const adminHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #27ae60; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">New Inquiry Received</h2>
                </div>
                <div style="padding: 30px;">
                    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p><strong>Message:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #27ae60;">
                        ${message}
                    </div>
                </div>
                <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                    Sent from Digital Smart Cities Hub Contact Form
                </div>
            </div>
        `;

        await sendEmail({
            to: adminEmail,
            subject: `New Contact Submission: ${subject}`,
            html: adminHtml
        });

        // 2. Send "Thank You" Email to the User
        const userHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                <div style="background: #2c3e50; padding: 20px; text-align: center; color: white;">
                    <h2 style="margin: 0;">Thank You for Contacting Us!</h2>
                </div>
                <div style="padding: 30px;">
                    <p>Dear ${firstName},</p>
                    <p>Thank you for reaching out to <strong>Digital Smart Cities Hub</strong>. We have received your message regarding "<strong>${subject}</strong>" and our team will get back to you shortly.</p>
                    <p>Your inquiry is important to us, and we appreciate your patience.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>Digital Smart Cities Hub Team</strong></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #999; font-style: italic;">
                        If you did not contact us, please ignore this mail.
                    </p>
                </div>
                <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777;">
                    &copy; ${new Date().getFullYear()} Digital Smart Cities Hub. All rights reserved.
                </div>
            </div>
        `;

        await sendEmail({
            to: email,
            subject: "We received your message - Digital Smart Cities Hub",
            html: userHtml
        });

        return res.status(200).json({
            success: true,
            message: "Your message has been sent successfully! Check your email for confirmation."
        });

    } catch (error) {
        console.error("ContactUsController error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }
};
