const mongoose = require("mongoose");
const fs = require("fs");

let courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required filed"],
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                return value.length >= 3;
            },
            message: "title must be larger than 3 characters"
        }
    },
    price: {
        type: Number,
        required: [true, "price is required field"]
    },
    releaseYear: {
        type: Number,
        required: [true, "release year is required field"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

courseSchema.virtual("priceInDollar").get(function () {
    return this.price / 3.5;
});

courseSchema.post("save", function (doc, next) {
    let content = `New course with title ${doc.title} added by Ziad. \n`;
    fs.appendFileSync("./log/log.txt", content);
    next();
})

courseSchema.pre(/^find/, function (next) {
    this.find({ releaseYear: { $lte: new Date().getFullYear() } });
    next();
});

courseSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $lte: new Date().getFullYear() } } });
    next();
});

module.exports = mongoose.model("Course", courseSchema);