const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { customError } = require("../utils/customError");
// Function to generate a QR code for a given product ID
exports.generateProductQRCode = async (link) => {
  try {
    return await QRCode.toDataURL(link, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      color: {
        dark: "#000000", // QR code color
        light: "#FFFFFF", // Background color
      },
    });
  } catch (error) {
    console.log(error);
    throw new customError(500, "QR Code generation failed");
  }
};

// bar code generator

exports.generateBarCode = async (code) => {
  try {
    return await bwipjs.toSVG({
      bcid: "code128", // Barcode type
      text: code, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: "center", // Always good to set this
    });
  } catch (error) {
    console.log(error);
    throw new customError(500, "Bar Code generation failed");
  }
};
