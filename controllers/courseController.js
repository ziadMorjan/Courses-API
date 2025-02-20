const Course = require("./../models/Course");
const QueryManipulater = require("../utils/QueryManipulater");

async function getAllCourses(req, res) {
    try {
        let qm = new QueryManipulater(Course, req)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        let courses = await qm.query;

        res.status(200).json({
            status: "success",
            length: courses.length,
            data: {
                courses
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function createCourse(req, res) {
    try {
        let course = await Course.create(req.body);
        res.status(201).json({
            status: "success",
            data: {
                course
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function checkId(req, res, next, value) {
    try {
        let course = await Course.findById(value);
        if (!course) {
            return res.status(404).json({
                status: "fail",
                message: `The course with id '${value}' is not found`
            });
        }
    } catch (error) {
        console.log(error.message);
    }
    next();
}

async function getSingleCourse(req, res) {
    try {
        let course = await Course.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                course
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function updateCourse(req, res) {
    try {
        let updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidator: true
        });
        res.status(200).json({
            status: "success",
            data: {
                updatedCourse
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function deleteCourse(req, res) {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

async function getCoursesStats(req, res) {
    try {
        let stats = await Course.aggregate([
            {
                $group: {
                    _id: null,
                    totalPrice: { $sum: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                    avgPrice: { $avg: '$price' },
                }
            },
            {
                $project: { '_id': 0 }
            }
        ]);
        res.status(200).json({
            status: "success",
            data: {
                stats
            }
        });
    } catch (error) {
        res.status(404).json({
            status: "fail",
            message: error.message,
            data: null
        });
    }
}

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    checkId,
    getCoursesStats
};