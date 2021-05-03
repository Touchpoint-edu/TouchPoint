var express = require("express")
var router = express.Router();

router.post("/", async (req, res) => {
    // can't manually expire jwt
    // can potentially add deny-list that stores jwt until its expiration
})

module.exports = router;