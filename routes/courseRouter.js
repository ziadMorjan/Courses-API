const express = require("express");
const courseController = require("../controllers/courseController");

let router = express.Router();

router.param("id", courseController.checkId)

router.route("/")
    .get(courseController.getAllCourses)
    .post(courseController.checkBody, courseController.createCourse);

router.route("/:id")
    .get(courseController.getSingleCourse)
    .patch(courseController.updateCourse)
    .delete(courseController.deleteCourse);

module.exports = {
    router
};