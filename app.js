const express = require("express");
const morgan = require("morgan");
const CoursesRoutes = require("./routes/CoursesRoutes");
const { globalErrorHandler } = require("./controllers/ErrorController");
const DefaultRoute = require("./routes/DefaultRoute");

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/courses", CoursesRoutes.router);
app.use(DefaultRoute);

app.use(globalErrorHandler)

module.exports = app;