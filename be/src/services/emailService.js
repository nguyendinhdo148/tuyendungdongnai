import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Khởi tạo transporter 1 lần duy nhất để tái sử dụng kết nối
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525, // Port này ổn định nhất khi deploy
  secure: false, // false cho port 2525
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

export const sendMail = async ({ to, subject, html, replyTo }) => {
  try {
    const mailOptions = {
      from: `"Tuyển dụng Đồng Nai" <${process.env.FROM_EMAIL}>`, 
      to,
      subject,
      html,
      replyTo: replyTo || undefined,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", to);
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    throw error;
  }
};

/**
 * Hàm gửi email reset mật khẩu
 */
export const sendResetPasswordEmail = async ({ email, resetUrl }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
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

/**
 * Hàm gửi email thông báo cho nhà tuyển dụng khi có người apply
 */
export const sendApplicationNotificationEmail = async ({
  recruiterEmail,
  recruiterName,
  candidateName,
  candidateEmail,
  jobTitle,
  jobUrl 
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: sans-serif; line-height: 1.6; background: #f5f7fa; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 40px; border-radius: 16px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { color: #0066ff; margin: 0; font-size: 24px; }
        .info-box { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066ff; }
        .info-box ul { list-style: none; padding: 0; margin: 0; }
        .info-box li { margin-bottom: 10px; }
        .action-button { background: #0066ff; color: #fff !important; padding: 12px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Có ứng viên mới!</h1>
        </div>
        
        <p>Chào <strong>${recruiterName || 'Nhà tuyển dụng'}</strong>,</p>
        <p>Bạn vừa nhận được một hồ sơ ứng tuyển mới cho vị trí <strong>${jobTitle}</strong> trên hệ thống Tuyển Dụng Đồng Nai.</p>
        
        <div class="info-box">
          <ul>
            <li>👤 <strong>Ứng viên:</strong> ${candidateName}</li>
            <li>✉️ <strong>Email liên hệ:</strong> <a href="mailto:${candidateEmail}">${candidateEmail}</a></li>
          </ul>
        </div>

        <p>Vui lòng đăng nhập vào hệ thống quản lý để xem chi tiết thông tin và đánh giá ứng viên này.</p>
        
        <div style="text-align: center;">
          <a href="${jobUrl || process.env.URL_CLIENT}" class="action-button">Về danh sách ứng viên</a>
        </div>
        
        <div class="footer">
          <p>© 2026 Tuyển dụng Đồng Nai.</p>
          <p>Bình Phước & Đồng Nai</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendMail({
    to: recruiterEmail,
    subject: `[Tuyển dụng Đồng Nai] Ứng viên ${candidateName} vừa ứng tuyển vị trí ${jobTitle}`,
    html,
    replyTo: candidateEmail 
  });
};