const express = require("express");
const morgan = require("morgan");
const CoursesRoutes = require("./routes/CoursesRoutes");
const UserRouts = require("./routes/UserRouts");
const AuthRouts = require("./routes/UserRouts");
const DefaultRoute = require("./routes/DefaultRoute");
const { globalErrorHandler } = require("./controllers/ErrorController");

let app = express();

// middlewares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/courses", CoursesRoutes);
app.use("/api/v1/users", UserRouts);
app.use("/api/v1/auth", AuthRouts);
app.use(DefaultRoute);

app.use(globalErrorHandler)

module.exports = app;