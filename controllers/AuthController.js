const CustomError = require("../utils/CustomError");
const { createToken } = require("../utils/JWTs");
const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const emails = require("./../utils/emails");

let sendResWithToken = function (res, statusCode, id) {

    let token = createToken(id);

    res.cookie("token", token, {
        maxAge: process.env.LOGIN_EXPIRE,
        httpOnly: true,
        secure: process.env.NODE_ENV == "production" ? true : false
    });

    res.status(statusCode).json({
        status: "success",
        data: {
            token
        }
    });
}

let signup = asyncErrorHandler(async function (req, res) {
    let newUser = await User.create(req.body);

    if (req.body.role && req.body.role == "admin")
        throw new CustomError("You can not signup as an admin!", 403);

    sendResWithToken(res, 201, newUser.id);
});

let login = asyncErrorHandler(async function (req, res) {
    let { email, password } = req.body;

    if (!email || !password)
        throw new CustomError("Please enter email & password to login!", 400);

    let user = await User.findOne({ email }).select("+password");

    if (!user || !bcryptjs.compareSync(password, user.password))
        throw new CustomError("Wrong email or password!", 400);

    sendResWithToken(res, 200, user.id);
});

let forgetPassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findOne({ email: req.body.email });
    if (!user)
        throw new CustomError("There is no user with the provided email!", 404);

    let resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpiredAt = Date.now() + 10 * 60 * 1000;
    user.save({ validateBeforeSave: false });

    let resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetPassword/${resetToken}`;
    let message = `We receive your request to reset your password, use this link to reset your password\n\n${resetUrl}\n\nThe reset url is valid for 10 minutes`;
    console.log(message);

    try {
        await emails.sendResetPasswordEmail({
            from: "Courses API",
            to: user.email,
            subject: "Resting Password",
            message
        });

        res.status(200).json({
            status: "success",
            message: "Reset link sent to your email"
        });

    } catch (error) {
        user.resetToken = undefined;
        user.resetTokenExpiredAt = undefined;
        user.save({ validateBeforeSave: false });

        throw new CustomError("Some thing was wrong with sending email, pleas try again later", 500);
    }

});

let resetPassword = asyncErrorHandler(async function (req, res) {
    let hashedResetPassword = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    let user = await User.findOne({
        resetToken: hashedResetPassword,
        resetTokenExpiredAt: {
            $gte: Date.now()
        }
    });

    if (!user)
        throw new CustomError("Invalid or Expired Token!", 400);

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.resetToken = undefined;
    user.resetTokenExpiredAt = undefined;
    user.passwordUpdatedAt = Date.now();
    await user.save();

    sendResWithToken(res, 200, user.id);
});

module.exports = {
    signup,
    login,
    forgetPassword,
    resetPassword
}