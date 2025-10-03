const nodemailer = require("nodemailer");
const { customError } = require("../utils/customError");
const { default: axios } = require("axios");
require("dotenv").config();
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV == "developement" ? false : true,
  auth: {
    user: "mahmudulislamg3@gmail.com",
    pass: "evni leeo fvix jtin",
  },
});

exports.emailSend = async (email, template) => {
  try {
    const info = await transporter.sendMail({
      from: "Cyclon",
      to: email,
      subject: "Confrim Registration",
      html: template,
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.log("error from nodemailer ", error);
    throw new customError(501, error);
  }
};

// sms sender
exports.smsSend = async (phoneNumber , message)=> {
  try {
    const response =  await axios.post(process.env.API_URL , {
      api_key:process.env.API_KEY, 
      senderid: process.env.SENDER_ID,
      number:Array.isArray(phoneNumber) ? phoneNumber.join(',') : phoneNumber,
  
      message:message
    })
    return response.data;
  } catch (error) {
    console.log('error from send sms' , error);
    throw new customError(500 , "smsSend function"+ error)
  }
}


