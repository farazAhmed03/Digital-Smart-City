import { baseTemplate } from './baseTemplate.js';

export const passwordResetTemplate = ({ otp, resetLink }) => {
    const content = `
        <h2 style="margin-top: 0; color: #dc3545;">Password Reset</h2>
        <p>We received a request to reset your password for your <span class="highlight">Digital Kohat</span> account.</p>
        
        ${otp ? `
            <p>Please use the following 6-digit OTP to proceed with your password reset:</p>
            <div style="text-align: center;">
                <div class="otp-code" style="color: #dc3545; border-color: #ffc107;">${otp}</div>
            </div>
        ` : `
            <p>Click the button below to safely reset your password. This link will expire shortly.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button" style="background-color: #dc3545;">Reset Password</a>
            </div>
        `}

        <p>If you didn't request this change, you can safely ignore this email. No changes will be made to your account until you use the code/link above.</p>
        <p>Stay secure,<br>The Digital Kohat Security Team</p>
    `;

    return baseTemplate(content);
};
