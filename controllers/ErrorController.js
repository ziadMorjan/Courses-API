function globalErrorHandler(error, req, res, next) {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "fail";
    if (process.env.NODE_ENV == "development") {
        devError(res, error);
    } else if (process.env.NODE_ENV == "production") {
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
        stack: error.stack
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

module.exports = {
    globalErrorHandler,
    asyncErrorHandler
};