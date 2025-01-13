const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required field"],
        uniqe: true
    },
    price: {
        type: Number,
        required: [true, "price is required field"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model("Course", courseSchema);