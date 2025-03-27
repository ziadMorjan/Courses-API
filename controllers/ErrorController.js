const CustomError = require("./../utils/CustomError");

function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "fail";
    if (process.env.NODE_ENV == "development") {
        devError(res, error);
    } else if (process.env.NODE_ENV == "production") {
        if (error.name == "CastError") error = CastErrorHandler(error);
        if (error.code == 11000) error = DuplicateKeyHandler(error);
        if (error.name == "ValidationError") error = ValidationErrorHandler(error);
        if (error.name == "JsonWebTokenError") error = JsonWebTokenErrorHandler();
        if (error.name == "TokenExpiredError") error = TokenExpiredErrorHandler();
        prodError(res, error);
    }
}

function asyncErrorHandler(asyncFunc) {
    return (req, res, next) => {
        asyncFunc(req, res, next).catch(error => next(error));
    }
}

function devError(res, error) {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error
    });
}

function prodError(res, error) {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: "fail",
            message: "Some thing is wrong! Pleas try again later."
        });
    }
}

function CastErrorHandler(error) {
    return new CustomError(`Invalid value for field ${error.path}: '${error.value}'`, 400);
}

function DuplicateKeyHandler(error) {
    let key = Object.keys(error.keyValue)[0];
    let value = Object.values(error.keyValue)[0];
    return new CustomError(`There is already document with ${key}: ${value}`, 400)
}

function ValidationErrorHandler(error) {
    let errors = Object.values(error.errors).map(value => value.message).join(". ");
    let message = `Validation Error: ${errors}`
    return new CustomError(message, 400);
}

function JsonWebTokenErrorHandler() {
    return new CustomError("Invalid token, please login!", 401);
}

function TokenExpiredErrorHandler() {
    return new CustomError("Expired token, please login again!", 401);
}

module.exports = {
    globalErrorHandler,
    asyncErrorHandler
};