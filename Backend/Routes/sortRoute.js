const express = require("express");
const router = express.Router();
const sortController = require("../Controllers/sortEvent");

router.get("/Eventcost", sortController.Eventcost);

module.exports = router;
