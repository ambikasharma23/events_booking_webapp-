const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
