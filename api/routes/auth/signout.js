var express = require("express")
var router = express.Router();

const { SERVER_ERROR_MSG } = require('../../constants/errors');
const JWT_COOKIE_NAME = 'c_user';

router.post("/", async (req, res) => {
    // can't manually expire jwt, clear cookie in frontend
    // can potentially add deny-list that stores jwt until its expiration
    res.sendStatus(200)
})

module.exports = router;