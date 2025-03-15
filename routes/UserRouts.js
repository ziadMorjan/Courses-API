let express = require("express");
let UserController = require("./../controllers/UserController");
let AuthController = require("./../controllers/AuthController");

let router = express.Router();

router.route("/")
    .get(UserController.getAllUsers)
    .post(UserController.createUser);

router.route("/:id")
    .get(UserController.getUser)
    .patch(UserController.updateUser)
    .delete(UserController.deleteUser);

module.exports = router;
