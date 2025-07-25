const exress = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { globalErrorhandler } = require("./utils/globalErrorHandler");
const app = exress();
/**
 * todo All middleare
 */
app.use(cors());
app.use(exress.json());
app.use(exress.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(exress.static("public"));
// routes
const apiVersion = process.env.BASE_URL;
app.use(`/api/v1`, require("./routes/index"));
// error handaling middleware
app.use(globalErrorhandler);

module.exports = { app };
