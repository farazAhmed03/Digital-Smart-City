import { baseTemplate } from './baseTemplate.js';

export const serviceProviderApprovalTemplate = (adminName, serviceName, sector, credentialsInstruction) => {
    const content = `
        <h2 style="margin-top: 0; color: #1f8e5c;">Registration Approved!</h2>
        <p>Hello <strong>${adminName}</strong>,</p>
        <p>We are thrilled to inform you that your request to join <span class="highlight">Digital Kohat</span> as a Service Provider has been <strong>successfully approved!</strong></p>
        
        <div style="background-color: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 25px; margin: 30px 0;">
            <span style="font-weight: 700; color: #1f8e5c; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; display: block; margin-bottom: 15px;">Approved Service Details</span>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding-bottom: 8px; color: #697386; font-size: 14px;">Service Name:</td>
                    <td style="padding-bottom: 8px; font-weight: 600; color: #1a1f36; font-size: 14px;">${serviceName}</td>
                </tr>
                <tr>
                    <td style="padding-bottom: 8px; color: #697386; font-size: 14px;">Sector:</td>
                    <td style="padding-bottom: 8px; font-weight: 600; color: #1a1f36; font-size: 14px;">${sector}</td>
                </tr>
                <tr>
                    <td style="color: #697386; font-size: 14px;">Status:</td>
                    <td style="font-weight: 600; color: #059669; font-size: 14px;">Active ✅</td>
                </tr>
            </table>
        </div>

        <div style="background-color: #ffffff; border-left: 4px solid #1f8e5c; padding: 20px; margin: 30px 0; border-radius: 0 8px 8px 0; background-color: #f9f9ff; border: 1px solid #eee; border-left-width: 4px;">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1a1f36;">Getting Started: Next Steps</h3>
            <ul style="margin: 0; padding-left: 20px; color: #4f566b; font-size: 14px; line-height: 1.8;">
                <li>Navigate to the <strong>Admin Portal</strong> on our website.</li>
                <li>${credentialsInstruction || "Log in using your registered email and password."}</li>
                <li>Access your dedicated <strong>Dashboard</strong> to manage your services and track inquiries.</li>
            </ul>
        </div>

        <p>You are now part of a growing ecosystem of digital services in Kohat. We look forward to your contributions!</p>
        <div style="text-align: center; margin: 35px 0;">
            <a href="https://digitalkohat.pk/admin/login" class="button">Go to Dashboard</a>
        </div>
        
        <p>Welcome to the network,<br>The Digital Kohat Team</p>
    `;

    return baseTemplate(content);
};
