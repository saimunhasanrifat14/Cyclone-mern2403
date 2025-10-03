require("dotenv").config();
const { DBconnection } = require("./src/database/db");
const { server } = require("./src/app");
DBconnection()
  .then(() => {
    server.listen(process.env.PORT || 4000, () => {
      console.log(`Server Runnin on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database Connection error ", error);
  });
