const express = require("express");
const courseController = require("./../controllers/courseController");
const { protect, allowTo } = require("../middlewares/AuthMiddleware");

let router = express.Router();

router.route("/coursesStats")
    .get(courseController.getCoursesStats);

router.route("/")
    .get(courseController.getAllCourses)
    .post(protect, allowTo("admin"), courseController.createCourse);

router.route("/:id")
    .get(courseController.getSingleCourse)
    .patch(protect, allowTo("admin"), courseController.updateCourse)
    .delete(protect, allowTo("admin"), courseController.deleteCourse);

module.exports = router;