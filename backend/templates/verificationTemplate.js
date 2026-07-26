import { baseTemplate } from './baseTemplate.js';

export const verificationTemplate = (otp) => {
    const content = `
        <h2 style="margin-top: 0;">Verify Your Account</h2>
        <p>Welcome to <span class="highlight">Digital Kohat</span>! We're excited to have you on board.</p>
        <p>To complete your registration and secure your account, please use the verification code below:</p>
        <div style="text-align: center;">
            <div class="otp-code">${otp}</div>
        </div>
        <p>This code is valid for <strong>10 minutes</strong>. If you didn't request this code, you can safely ignore this email.</p>
        <p>Thank you,<br>The Digital Kohat Team</p>
    `;
    return baseTemplate(content);
};
