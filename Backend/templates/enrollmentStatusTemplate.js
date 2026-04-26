import { baseTemplate } from './baseTemplate.js';

export const enrollmentStatusTemplate = (courseName, status, reason = "", whatsappGroupLink = "") => {
    const isApproved = status === "Approved";
    
    const content = `
        <h2 style="margin-top: 0; color: ${isApproved ? '#198754' : '#dc3545'};">
            Enrollment ${status}
        </h2>
        <p>Dear Student,</p>
        <p>This is an update regarding your enrollment for the course: <span class="highlight">${courseName}</span>.</p>
        
        <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${isApproved ? '#198754' : '#dc3545'};">
            <p style="margin: 0;"><strong>Status:</strong> ${status}</p>
            ${reason ? `<p style="margin: 10px 0 0 0;"><strong>Feedback:</strong> ${reason}</p>` : ''}
        </div>

        ${isApproved && whatsappGroupLink ? `
            <div style="text-align: center; margin: 30px 0;">
                <p>Welcome to the batch! Join the official WhatsApp group to get started:</p>
                <a href="${whatsappGroupLink}" class="button" style="color: #25D366; border: none;">Join WhatsApp Group</a>
            </div>
        ` : ''}

        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The Digital Kohat Education Dept.</p>
    `;

    return baseTemplate(content);
};
