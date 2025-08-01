const nodemailer = require("nodemailer");
require("dotenv").config();
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV == "developement" ? false : true,
  auth: {
    user: "saimunhasanrifat14@gmail.com",
    pass: process.env.APP_PASSWORD || "vrlw lpte gpkf ytfs",
  },
});

exports.emailSend = async (email, template) => {
  const info = await transporter.sendMail({
    from: "Cyclon",
    to: email,
    subject: "Confrim Registration",
    html: template,
  });

  console.log("Message sent:", info.messageId);
};
