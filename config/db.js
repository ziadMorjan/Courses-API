const mongoose = require("mongoose");

function connect(url) {
    mongoose.connect(url)
        .then((conn) => {
            console.log("Connected to DB successfully");
        })
        .catch((error) => {
            console.log(error.message);
        });
}

module.exports = { connect };