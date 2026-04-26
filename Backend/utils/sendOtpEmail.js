import { sendEmail } from "./emailSender.js";
import { verificationTemplate } from "../templates/verificationTemplate.js";

export const sendOtpEmail = async (userEmail, otp) => {
  try {
    const emailHtml = verificationTemplate(otp);
    
    const success = await sendEmail({
      to: userEmail,
      subject: "Your OTP for Account Registration - Digital Kohat",
      html: emailHtml
    });

    return success;
  } catch (err) {
    console.log("sendOtpEmail Error:", err.message);
    return false;
  }
};
