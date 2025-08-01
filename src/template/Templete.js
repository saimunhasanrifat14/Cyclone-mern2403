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
