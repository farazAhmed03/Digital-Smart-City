import { baseTemplate } from './baseTemplate.js';

export const appointmentTemplate = (patientName, doctorName, date, time, appointmentNumber, consultationType, meetingLink) => {
    const isOnline = consultationType === "ONLINE";
    
    const content = `
        <h2 style="margin-top: 0; color: #1f8e5c;">Appointment Confirmed</h2>
        <p>Dear <strong>${patientName}</strong>,</p>
        <p>Your appointment with <span class="highlight">Dr. ${doctorName}</span> has been successfully confirmed. Please find your details below:</p>
        
        <div style="background-color: #f8f9fa; border-left: 5px solid #1f8e5c; padding: 25px; margin: 25px 0; border-radius: 4px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding-bottom: 10px; color: #666; font-size: 14px;">Consultation Type:</td>
                    <td style="padding-bottom: 10px; font-weight: 700; color: #111; font-size: 14px;">${consultationType || "IN-CLINIC"}</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px; color: #666; font-size: 14px;">Date:</td>
                    <td style="padding-bottom: 10px; font-weight: 700; color: #111; font-size: 14px;">${date}</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 10px; color: #666; font-size: 14px;">Time:</td>
                    <td style="padding-bottom: 10px; font-weight: 700; color: #111; font-size: 14px;">${time}</td>
                </tr>
                <tr>
                    <td style="color: #666; font-size: 14px;">Appointment No:</td>
                    <td style="font-weight: 800; color: #1f8e5c; font-size: 20px;">#${appointmentNumber}</td>
                </tr>
            </table>
            
            ${isOnline && meetingLink ? `
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #ced4da; text-align: center;">
                    <p style="margin-bottom: 15px;"><strong>Join Online Consultation:</strong></p>
                    <a href="${meetingLink}" class="button" style="background-color: #1f8e5c; margin: 0;">Start Meeting</a>
                </div>
            ` : ""}
        </div>
        
        <p style="font-size: 14px; color: #666;">
            ${isOnline 
                ? "Please ensure you have a stable internet connection and find a quiet place for your consultation." 
                : "Please arrive at the clinic at least 15 minutes before your scheduled time for check-in."}
        </p>
        
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        <p>Best regards,<br>The Digital Kohat Health Team</p>
    `;

    return baseTemplate(content);
};
