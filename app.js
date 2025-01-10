const express = require("express");
const morgan = require("morgan");
const courseRouter = require("./routes/courseRouter");

let app = express();

//midllelwares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/courses", courseRouter.router);

module.exports = app;