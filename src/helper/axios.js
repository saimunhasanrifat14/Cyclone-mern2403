const { default: axios } = require("axios");

const instance = axios.create({
  baseURL: process.env.COURIER_BASE_URL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.COURIER_API_KEY,
    "Secret-Key": process.env.COURIER_API_SECRECT,
  },
});

module.exports = { instance };
