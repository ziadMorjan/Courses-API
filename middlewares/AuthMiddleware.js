const { asyncErrorHandler } = require("../controllers/ErrorController");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const { verifyToken } = require("../utils/JWTs");

let protect = asyncErrorHandler(async function (req, res, next) {
    let authHeader = req.headers.authorization;
    let token;
    if (authHeader && authHeader.startsWith("Bearer"))
        token = authHeader.split(" ")[1];
    if (!token)
        throw new CustomError("You are not logged in, please login!", 401);

    let decodedToken = await verifyToken(token);

    let user = await User.findById(decodedToken.id);
    if (!user)
        throw new CustomError("You are not logged in, please login!", 401);

    if (user.passwordUpdatedAt) {
        let passwordUpdatedAtTimestamp = parseInt(user.passwordUpdatedAt.getTime() / 1000, 10);
        if (passwordUpdatedAtTimestamp > decodedToken.iat)
            throw new CustomError("You have changed your password recently, please login again", 401);
    }

    req.user = user;
    next();
});

let allowTo = function (...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            throw new CustomError("You do not have the permeation to preform this action", 403);
        next();
    }
}

module.exports = {
    protect,
    allowTo
}