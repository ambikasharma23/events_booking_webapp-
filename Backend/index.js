const express = require("express");
const app = express();
const db = require("./models");
const router = require("./Routes/eventRoute");
app.use(express.json());
app.use("/", router);
const PORT = process.env.PORT || 3001;

db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
