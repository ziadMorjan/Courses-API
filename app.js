const express = require("express");
const morgan = require("morgan");
const expressRateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const CoursesRoutes = require("./routes/CoursesRoutes");
const UserRouts = require("./routes/UserRouts");
const AuthRouts = require("./routes/AuthRouts");
const DefaultRoute = require("./routes/DefaultRoute");
const { globalErrorHandler } = require("./controllers/ErrorController");

let app = express();

let limiter = expressRateLimit({
    windowMS: 60 * 60 * 1000,
    max: 100000,
    message: "You have reached the limit of requests, please try again in an hour"
});

// middlewares
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(sanitize());
app.use(xss());
app.use(hpp());

// routes
app.use("/api/v1/courses", CoursesRoutes);
app.use("/api/v1/users", UserRouts);
app.use("/api/v1/auth", AuthRouts);
app.use(DefaultRoute);

app.use(globalErrorHandler);

module.exports = app;