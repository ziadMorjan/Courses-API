const mongoose = require("mongoose");

function connectToDb(url) {
    mongoose.connect(url)
        .then((conn) => {
            console.log("Connected to DB successfuly");
        })
        .catch((error) => {
            console.log(error.message);
        });
}

module.exports = connectToDb;