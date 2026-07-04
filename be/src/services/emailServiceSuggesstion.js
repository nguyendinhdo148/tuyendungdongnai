import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendSuggestionEmail = async (to, subject, html) => {
  // Sử dụng API Key thay vì SMTP Password
  const apiKey = process.env.BREVO_API_KEY; 
  const senderEmail = process.env.BREVO_USER;

  if (!apiKey || !senderEmail) {
    console.error(
      "Email configuration missing. Please check BREVO_API_KEY and BREVO_USER environment variables."
    );
    return;
  }

  // Cấu trúc payload theo chuẩn API v3 của Brevo
  const payload = {
    sender: {
      name: "VieJobs",
      email: senderEmail,
    },
    to: [
      {
        email: to,
      },
    ],
    subject: subject,
    htmlContent: html,
  };

  try {
    // Gọi thẳng HTTP API bằng fetch (có sẵn trong Node.js)
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }

    const info = await response.json();
    return info;
  } catch (error) {
    console.error("Failed to send email via Brevo API:", error.message);
    throw error;
  }
};