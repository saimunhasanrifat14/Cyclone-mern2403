require("dotenv").config();
const exress = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { globalErrorhandler } = require("./utils/globalErrorHandler");
const app = exress();
const http = require("http");
const morgan = require("morgan");
const { initSocket } = require("./socket/server");
/**
 * todo All middleare
 */
const server = http.createServer(app);
const io = initSocket(server);
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}
app.use(exress.json());
app.use(exress.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(exress.static("public"));
// routes
const apiVersion = process.env.BASE_URL;
app.use(`/api/v1`, require("./routes/index"));

// error handaling middleware
app.use(globalErrorhandler);

module.exports = { server, io };
