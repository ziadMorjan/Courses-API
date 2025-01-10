const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

let port = 5000,
    hostname = "localhost";

app.listen(port, hostname, () => {
    console.log("Server started...");
});