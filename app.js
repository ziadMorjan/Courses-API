const express = require("express");
const morgan = require("morgan");
const CoursesRoutes = require("./routes/CoursesRoutes");
const UserRouts = require("./routes/UserRouts");
const DefaultRoute = require("./routes/DefaultRoute");
const { globalErrorHandler } = require("./controllers/ErrorController");

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/courses", CoursesRoutes.router);
app.use("/api/v1/users", UserRouts.router);
app.use(DefaultRoute);

app.use(globalErrorHandler)

module.exports = app;