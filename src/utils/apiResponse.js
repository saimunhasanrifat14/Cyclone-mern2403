class apiResponse {
  constructor(status, message, data) {
    this.status = status >= 200 && status < 300 ? "OK" : "Error";
    this.statusCode = status || 500;
    this.message = message || "success";
    this.data = data;
  }
  static sendSucess(res, status, message, data) {
    return res.status(status).json(new apiResponse(status, message, data));
  }
}

module.exports = { apiResponse };
