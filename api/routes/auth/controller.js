const express = require("express")

const signupRouter = require("./signup");
const signinRouter = require("./signin");
const emailRouter = require("./email_verification").router;

const router = express.Router();

router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use("/email_verification", emailRouter);

module.exports = router;