const express = require("express")
const verify = require('../../scripts/verify')

const signupRouter = require("./signup");
const signinRouter = require("./signin");
const emailRouter = require("./email_verification").router;

const router = express.Router();

router.use("/signup", signupRouter);
router.use("/signin", signinRouter);
router.use("/email_verification", emailRouter);

router.get("/username", async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);

        res.status(200)
        res.json({
            name: userPayload.name
        })
    } catch (err) {
        res.sendStatus(401)
    }
})

module.exports = router;