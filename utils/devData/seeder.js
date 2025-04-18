const dotenv = require("dotenv");
dotenv.config({ path: "./../../config.env" });
const fs = require("fs");
const db = require("./../../config/db");
const Course = require("./../../models/Course");
const User = require("../../models/User");

db.connect(process.env.CONN_STR);

let courses = JSON.parse(fs.readFileSync("./courses.json", "utf-8"));
let users = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

async function deleteDoc() {
    try {
        await Course.deleteMany();
        await User.deleteMany();
        console.log("Documents deleted successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}
async function importDoc() {
    try {
        await Course.create(courses);
        await User.create(users);
        console.log("Documents imported successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

if (process.argv[2] == "-d") {
    deleteDoc();
}
if (process.argv[2] == "-i") {
    importDoc();
}
