require("dotenv").config();
const { DBconnection } = require("./src/database/db");
const { server } = require("./src/app");
const chalk = require("chalk");
DBconnection()
  .then(() => {
    server.listen(process.env.PORT || 4000, () => {
      console.log(
        chalk.bgGreenBright(
          `Server Runnin on http://localhost:${process.env.PORT}`
        )
      );
    });
  })
  .catch((error) => {
    console.log("Database Connection error ", error);
  });
