import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html
  };

  // Check if credentials exist
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email credentials missing. processing without sending email.');
    return;
  }

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${options.email}`);
  } catch (error) {
    console.error('Email send failed:', error.message);
    // Do not throw error to avoid crashing the server loop
  }
};

// Email templates
const getPasswordResetEmail = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0f2744, #1a4a6e); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #1a4a6e, #3d8b8b); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 SCMS</h1>
          <p>Student Career Management System</p>
        </div>
        <div class="content">
          <h2>Password Reset Request</h2>
          <p>Hello ${userName},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Student Career Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getEmailVerificationEmail = (verifyUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0f2744, #1a4a6e); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #1a4a6e, #3d8b8b); color: white; text-decoration: none; padding: 14px 30px; border-radius: 8px; margin: 20px 0; font-weight: 600; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 SCMS</h1>
          <p>Student Career Management System</p>
        </div>
        <div class="content">
          <h2>Welcome to SCMS!</h2>
          <p>Hello ${userName},</p>
          <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" class="button">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Student Career Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export { sendEmail, getPasswordResetEmail, getEmailVerificationEmail };
