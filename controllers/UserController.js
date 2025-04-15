const CustomError = require("../utils/CustomError");
const { createToken } = require("../utils/JWTs");
const QueryManipulater = require("../utils/QueryManipulater");
const User = require("./../models/User");
const { asyncErrorHandler } = require("./ErrorController");
const bcryptjs = require("bcryptjs");

let getAllUsers = asyncErrorHandler(async function (req, res) {
    let qm = new QueryManipulater(User, req)
        .filter()
        .limitFields()
        .sort()
        .paginate();

    let users = await qm.query;

    res.status(200).json({
        status: "success",
        length: users.length,
        data: {
            users
        }
    });

});

let getUser = asyncErrorHandler(async function (req, res) {

    let user = await User.findById(req.params.id);

    if (!user)
        throw new CustomError(`There is no user found with id '${req.params.id}'!`);

    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });

});

let createUser = asyncErrorHandler(async function (req, res) {
    let newUser = await User.create(req.body);

    res.status(201).json({
        status: "success",
        data: {
            newUser
        }
    });
});

let updateUser = asyncErrorHandler(async function (req, res) {
    let updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!updatedUser)
        throw new CustomError(`There is no user found with id '${req.params.id}'!`);

    res.status(200).json({
        status: "success",
        data: {
            updatedUser
        }
    });
});

let deleteUser = asyncErrorHandler(async function (req, res) {
    let deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
        throw new CustomError(`There is no user found with id '${req.params.id}'!`);

    res.status(204).json({
        status: "success",
        data: {
            deletedUser
        }
    });
});

let changePassword = asyncErrorHandler(async function (req, res) {
    let user = await User.findById(req.user.id).select("+password");

    if (!bcryptjs.compareSync(req.body.currentPassword, user.password))
        throw new CustomError("The provided password is wrong", 400);

    user.password = req.body.newPassword;
    user.confirmPassword = req.body.newConfirmPassword;
    user.passwordUpdatedAt = Date.now();
    await user.save();

    let token = createToken(user.id);

    res.status(200).json({
        status: "success",
        token
    });

});

let updateMe = asyncErrorHandler();

let deleteMe = asyncErrorHandler();

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    changePassword,
    updateMe,
    deleteMe
}