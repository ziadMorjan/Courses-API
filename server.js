const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const connectToDb = require("./config/connectToDb");

let port = 5000,
    hostname = "localhost";

app.listen(port, hostname, () => {
    console.log(`Server started on http://${hostname}:${port}`);
});

connectToDb(process.env.CONN_STR);