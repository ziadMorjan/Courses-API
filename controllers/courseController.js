const fs = require("fs");

let courses = JSON.parse(fs.readFileSync("./data/courses.json", "utf-8"));

function getAllCourses(req, res) {
    res.status(200).json({
        stauts: "sucess",
        data: {
            courses
        }
    });
}

function checkBody(req, res, next) {
    if (!req.body.title || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "Title and price is require."
        });
    }
    next();
}

function createCourse(req, res) {
    let newCourse = {
        id: courses.length + 1,
        ...req.body
    };

    courses.push(newCourse);

    fs.writeFile("./data/courses.json", JSON.stringify(courses), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(201).json({
            stauts: "sucess",
            data: {
                newCourse
            }
        });
    });

}

function checkId(req, res, next, value) {
    let course = courses.find((ele) => ele.id === +value);

    if (!course) {
        return res.status(404).json({
            stauts: "fail",
            message: `The course with id ${value} is not found`,
            data: {
                course: null
            }
        });
    }
    next();
}

function getSingleCourse(req, res) {
    let course = courses.find((ele) => ele.id === +req.params.id);

    res.status(200).json({
        stauts: "sucess",
        data: {
            course
        }
    });
}

function updateCourse(req, res) {
    let course = courses.find((ele) => ele.id === +req.params.id);
    course = {
        ...course,
        ...req.body
    };

    fs.writeFile("./data/courses.json", JSON.stringify(courses), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(201).json({
            stauts: "sucess",
            data: {
                course
            }
        });
    });
}

function deleteCourse(req, res) {
    let course = courses.find((ele) => ele.id === +req.params.id);

    courses = courses.filter((ele) => ele.id !== course.id);

    fs.writeFile("./data/courses.json", JSON.stringify(courses), (err) => {
        if (err) {
            console.log(err);
        }
        res.status(203).json({
            stauts: "sucess",
            data: {
                course: null
            }
        });
    });
}

module.exports = {
    getAllCourses,
    getSingleCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    checkId,
    checkBody
};