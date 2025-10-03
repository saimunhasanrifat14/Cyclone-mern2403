exports.RegistrationTemplate = (
  firstName,
  verificationLink,
  otp,
  expireTime
) => {
  return `

<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome to Our E-commerce</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: #4f46e5;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 30px;
      color: #333333;
    }
    .content h2 {
      margin-top: 0;
      color: #111827;
    }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin-top: 20px;
      background: #4f46e5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .footer {
      background: #f4f4f7;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Welcome, ${firstName}!</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Thanks for registering ${expireTime} 🎉</h2>
      <p>
        Your OTP :  ${otp},<br><br>
        Thank you for signing up with us. Please confirm your email address to complete your registration and unlock all features.
      </p>
      <a href="${verificationLink}" class="btn">Confirm Email</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>&copy; 2025 Your Company. All rights reserved.</p>
      <p>If you didn’t register, please ignore this email.</p>
    </div>
  </div>
</body>
</html>

    `;
};

// reset password email template
exports.resetPasswordEmailTemplate = (
  firstName,
  verifyLink,
  otp,
  expireTime
) => {
  return `
  
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f9fa;
      padding: 20px;
      color: #333;
    }
    .container {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 8px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .btn {
      background-color: #007bff;
      color: #ffffff !important;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 20px;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello, ${firstName} 👋</h2>
    <p>You recently requested to reset your password. Please use the OTP and link below to complete the process:</p>

    <p><strong>🔐 One-Time Password (OTP):</strong> <code style="font-size: 18px;">${otp}</code></p>
    
    <p><strong>📎 Reset Link:</strong></p>
    <p><a class="btn" href="${verifyLink}">Reset Your Password</a></p>

    <p>This link and OTP will expire in <strong>${expireTime}</strong>.</p>

    <p>If you didn't request a password reset, you can safely ignore this email.</p>

    <div class="footer">
      <p>Thank you,<br>The Support Team</p>
    </div>
  </div>
</body>
</html>

  `;
};
