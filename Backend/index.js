const express = require("express");
const app = express();
const db = require("./models");
const router = require("./Routes/eventRoute");
const sessionRoute = require("./Routes/sessionsRoutes");
 app.use("/", router);
 app.use(express.json());
 app.use("/sessions", sessionRoute);


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
