const Router = require("express").Router;
const { body } = require("express-validator");
const controller = require("../controllers/GameController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = new Router();

router.post(
    "/create",
    authMiddleware,
    body("color").matches(/^(white|black)$/),
    controller.create
);
// router.post(
//     "/registration",
//     body("username").isLength({ min: 3, max: 32 }),
//     body("password").isLength({ min: 3, max: 32 }),
//     controller.registration
// );
// router.post("/login", controller.login);
// router.post("/logout", controller.logout);
// router.get("/refresh", controller.refresh);

module.exports = router;
