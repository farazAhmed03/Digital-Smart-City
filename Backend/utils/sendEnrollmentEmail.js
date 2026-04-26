import { sendEmail } from "./emailSender.js";
import { enrollmentStatusTemplate } from "../templates/enrollmentStatusTemplate.js";

export const sendEnrollmentEmail = async (userEmail, courseName, status, reason = "", whatsappGroupLink = "") => {
  try {
    const emailHtml = enrollmentStatusTemplate(courseName, status, reason, whatsappGroupLink);

    const subject = status === "Approved"
      ? `Enrollment Confirmed: ${courseName} - Digital Kohat`
      : `Update on your Enrollment: ${courseName} - Digital Kohat`;

    const success = await sendEmail({
      to: userEmail,
      subject,
      html: emailHtml
    });
    return success;
  } catch (err) {
    console.log("sendEnrollmentEmail Error:", err.message);
    return false;
  }
};
