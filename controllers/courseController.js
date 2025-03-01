const Course = require("./../models/Course");
const QueryManipulater = require("./../utils/QueryManipulater");
const { asyncErrorHandler } = require("./ErrorController");
const CustomError = require("./../utils/CustomError");

let getAllCourses = asyncErrorHandler(async function (req, res) {
    let qm = new QueryManipulater(Course, req)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    let courses = await qm.query;

    res.status(200).json({
        status: "success",
        count: courses.length,
        data: {
            courses
        }
    });
});

let createCourse = asyncErrorHandler(async function (req, res) {
    let course = await Course.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            course
        }
    });
});

let getSingleCourse = asyncErrorHandler(async function (req, res) {
    let course = await Course.findById(req.params.id);
    if (!course) {
        throw new CustomError(`There is no course found with Id '${req.params.id}'`, 404);
    }
    res.status(200).json({
        status: "success",
        data: {
            course
        }
    });
});

let updateCourse = asyncErrorHandler(async function (req, res) {
    let updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidator: true
    });
    if (!updatedCourse) {
        throw new CustomError(`There is no course found with Id '${req.params.id}'`, 404);
    }
    res.status(200).json({
        status: "success",
        data: {
            updatedCourse
        }
    });
});

let deleteCourse = asyncErrorHandler(async function (req, res) {
    let deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
        throw new CustomError(`There is no course found with Id ${req.params.id}`, 404);
    }
    res.status(204).json({
        status: "success",
        data: null
    });
});

let getCoursesStats = asyncErrorHandler(async function (req, res) {
    let stats = await Course.aggregate([
        {
            $group: {
                _id: "$releaseYear",
                count: { $sum: 1 },
                totalPrice: { $sum: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                avgPrice: { $avg: "$price" },
            }
        },
        {
            $addFields: { "releaseYear": "$_id" }
        },
        {
            $project: { "_id": 0 }
        },
        {
            $sort: { "releaseYear": 1 }
        }
    ]);
    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    });
});

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCoursesStats
};