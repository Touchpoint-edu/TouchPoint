var express = require("express")
var router = express.Router();
const mongoose = require('mongoose');
var mongo = require('../models/mongo');

router.post("/auth", async (req, res) => {
    //iterates through json file
    console.log("parsing student names");
    var file = req.body; 
    //console.log(file);
    for(var i = 5; i < file.length; i++) {
        var obj = file[i];
        console.log(obj.FIELD2); 

    }
    res.sendStatus(200);
})

// router.get("/auth/email/validate/:emailID", async (req, res) => {
//     var emailID = req.params.emailID; 
//     console.log(emailID); 
//     res.sendStatus(200); 
// })
module.exports = router;