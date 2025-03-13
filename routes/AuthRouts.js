let express = require("express");
let UserController = require("./../controllers/UserController");
let AuthController = require("./../controllers/AuthController");

let router = express.Router();

router.route("/signup")
    .post(AuthController.signup);

module.exports = router;
