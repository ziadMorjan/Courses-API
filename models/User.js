const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { asyncErrorHandler } = require("../controllers/ErrorController");

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: [true, "firstName is require field"]
    },

    lastName: {
        type: String,
        require: [true, "lastName is require field"]
    },

    email: {
        type: String,
        require: [true, "email is require field"],
        unique: true,
        validate: [validator.isEmail, "pleas enter valid email"]
    },

    password: {
        type: String,
        require: [true, "password is require field"],
        minlength: [8, "password length must be more than 8 characters"],
        select: false
    },

    confirmPassword: {
        type: String,
        require: [true, "confirm password password is require field"],
        minlength: [8, "confirm password length must be more than 8 characters"],
        validate: {
            validator: function (value) {
                return value == this.password;
            },
            message: "password and confirm password are not same"
        }
    },

    photo: {
        type: String,
        default: ""
    }
});

userSchema.pre("save", function (next) {
    // check if password modified, so don't hash the hashed password
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hashSync(this.password, 10);
    this.confirmPassword = undefined;

    next();
});

module.exports = mongoose.model("User", userSchema);