import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo transporter 1 lần duy nhất để tái sử dụng kết nối
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525, // Port này ổn định nhất khi deploy trên Render
  secure: false, // false cho port 2525
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendMail = async ({ to, subject, html, replyTo }) => {
  try {
    const mailOptions = {
      // Sử dụng biến FROM_EMAIL mới tạo
      from: `"Tuyển dụng Đồng Nai" <${process.env.FROM_EMAIL}>`, 
      to,
      subject,
      html,
      replyTo: replyTo || undefined,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};

/**
 * Hàm gửi email reset mật khẩu (tái sử dụng hàm sendMail)
 */
export const sendResetPasswordEmail = async ({ email, resetUrl }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        /* CSS của bạn giữ nguyên */
        body { font-family: sans-serif; line-height: 1.6; background: #f5f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; text-align: center; }
        .reset-button { background: #0066ff; color: #fff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔑 Reset Your Password</h1>
        <p>We received a request to reset your password.</p>
        <a href="${resetUrl}" class="reset-button">🔗 Reset Password</a>
        <p>© 2026 Tuyển dụng Đồng Nai.</p>
      </div>
    </body>
    </html>
  `;

  return await sendMail({
    to: email,
    subject: "🔒 Reset Your Password - Tuyển dụng Đồng Nai",
    html,
  });
};