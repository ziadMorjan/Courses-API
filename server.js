const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const db = require("./config/db");

let port = 5000,
    hostname = "localhost";

app.listen(port, hostname, () => {
    console.log(`Mode => ${process.env.NODE_ENV}`);
    console.log(`Server started on => http://${hostname}:${port}`);
});

db.connect(process.env.CONN_STR);