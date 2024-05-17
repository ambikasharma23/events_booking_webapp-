const express = require("express");
const app = express();
const db = require("./models");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", require("./Routes/eventRoute"));
app.use("/", require("./Routes/sessionsRoutes"));
app.use("/", require("./Routes/ticketRoute"));
app.use("/", require("./Routes/eventgalleryRoute"));
app.use("/", require("./Routes/eventexceptionRoute"));
app.use("/", require("./Routes/bookingRoute"));

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  }).catch((error) => {
    console.error("Error starting server:", error);
});