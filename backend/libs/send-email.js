import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const fromEmail = process.env.FROM_EMAIL;
const sendGridApiKey = process.env.SEND_GRID_API;
const isSendGridConfigured =
  typeof sendGridApiKey === "string" && sendGridApiKey.startsWith("SG.");

if (isSendGridConfigured) {
  sgMail.setApiKey(sendGridApiKey);
}

export const sendEmail = async (to, subject, html) => {
  if (!isSendGridConfigured) {
    console.warn(
      "SendGrid is not configured. Skipping email send for local development."
    );
    return false;
  }

  const msg = {
    to,
    from: `TaskHub <${fromEmail}>`,
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully");

    return true;
  } catch (error) {
    console.error("Error sending email:", error);

    return false;
  }
};

export { isSendGridConfigured };
