var express = require("express")
var router = express.Router();

router.post("/", async (req, res) => {
    // can't manually expire jwt, clear cookie in frontend
    // can potentially add deny-list that stores jwt until its expiration
    res.sendStatus(200)
})

module.exports = router;