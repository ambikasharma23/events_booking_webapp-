const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3001;
const router = require("./Routes/eventRoute");

app.use("/", router);
const PORT = process.env.PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running",PORT);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
