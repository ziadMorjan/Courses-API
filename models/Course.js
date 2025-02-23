const mongoose = require("mongoose");

let courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title is required field"],
        uniqe: true
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

courseSchema.pre(/^find/, function (next) {
    this.find({ releaseYear: { $lte: new Date().getFullYear() } });
    next();
});

courseSchema.pre("aggregate", function (next) {
    this.pipeline().unshift({ $match: { releaseYear: { $lte: new Date().getFullYear() } } });
    next();
});

module.exports = mongoose.model("Course", courseSchema);