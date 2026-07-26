import { baseTemplate } from './baseTemplate.js';

export const admissionApprovalTemplate = (studentName, instituteName, targetClass) => {
    const content = `
        <h2 style="margin-top: 0; color: #198754;">Admission Confirmed!</h2>
        <p>Congratulations <strong>${studentName}</strong>,</p>
        <p>We are delighted to inform you that your admission request for <span class="highlight">${instituteName}</span> has been <strong>successfully approved</strong>.</p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #d1fae5; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <span style="font-weight: 700; color: #198754; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 15px;">Enrollment Details</span>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding-bottom: 8px; color: #6b7280; font-size: 14px;">Institute:</td>
                    <td style="padding-bottom: 8px; font-weight: 600; color: #111827; font-size: 14px;">${instituteName}</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 8px; color: #6b7280; font-size: 14px;">Target Class:</td>
                    <td style="padding-bottom: 8px; font-weight: 600; color: #111827; font-size: 14px;">${targetClass}</td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 14px;">Status:</td>
                    <td style="font-weight: 600; color: #198754; font-size: 14px;">Admission Confirmed ✅</td>
                </tr>
            </table>
        </div>

        <div style="background-color: #ffffff; border-left: 4px solid #198754; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; background-color: #f9fffb; border: 1px solid #eee; border-left-width: 4px;">
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #111827;">Next Steps</h3>
            <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">Please visit the institute's administration office with your original documents to complete the physical registration and fee submission.</p>
        </div>

        <p>We wish you the very best for your academic future at ${instituteName}.</p>
        <p>Warm regards,<br>The Digital Kohat Education Team</p>
    `;

    return baseTemplate(content);
};
