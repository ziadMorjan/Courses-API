const dotenv = require("dotenv");
dotenv.config({ path: "./../config.env" });
const fs = require("fs");
const connectToDb = require("./../config/connectToDb");
const Course = require("./../models/Course");

connectToDb(process.env.CONN_STR);

let courses = JSON.parse(fs.readFileSync("./courses.json", "utf-8"));

async function deleteDoc() {
    try {
        await Course.deleteMany();
        console.log("Documents deleted successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}
async function importDoc() {
    try {
        await Course.create(courses);
        console.log("Documents imported successfully");
    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

if (process.argv[2] == "--delete") {
    deleteDoc();
}
if (process.argv[2] == "--import") {
    importDoc();
}
