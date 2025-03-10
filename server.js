const dotenv = require("dotenv");
const db = require("./config/db");

process.on("uncaughtException", (error) => {
    console.log(error.name, error.message);
    console.log("Uncaught Exception occurred! Shutting down...");
    process.exit(1);
});

const app = require("./app");
dotenv.config({ path: "./config.env" });

let port = 5000,
    hostname = "localhost";

let server = app.listen(port, hostname, () => {
    console.log(`Mode => ${process.env.NODE_ENV}`);
    console.log(`Server started on => http://${hostname}:${port}`);
});

db.connect(process.env.CONN_STR);

process.on("unhandledRejection", (error) => {
    console.log(error.name, error.message);
    console.log("Unhandled Rejection occurred! Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});