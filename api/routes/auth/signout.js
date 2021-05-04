var express = require("express")
var router = express.Router();

const { SERVER_ERROR_MSG } = require('../../constants/errors');
const JWT_COOKIE_NAME = 'c_user';

router.post("/", async (req, res) => {
    // can't manually expire jwt, can only clear cookie
    // can potentially add deny-list that stores jwt until its expiration

    try {
        req.clearCookie(JWT_COOKIE_NAME)
        res.sendStatus(200)
    } catch (err) {
        sendError(500, SERVER_ERROR_MSG)
    }
})

module.exports = router;