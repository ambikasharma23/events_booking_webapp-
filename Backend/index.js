const express = require("express");
const app = express();
const db = require("./models");

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/", require("./Routes/eventRoute"));
app.use("/", require("./Routes/ticketRoute"));


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  }).catch((error) => {
    console.error("Error starting server:", error);
});
