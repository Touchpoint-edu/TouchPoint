var express = require("express")
const mongoose = require('mongoose');
var mongo = require('../models/mongo');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const { CSV_FORMAT_ERROR_MSG, SERVER_ERROR_MSG } = require('../constants/errors');

var router = express.Router();
const upload = multer({ dest: 'csv/' });

router.post("/upload", upload.single('file'), async (req, res) => {
    // 2D array of students (row = student, cols = name, email)
    const fileRows = [];

    csv.parseFile(req.file.path,
        {
            headers: [undefined, 'name', 'email', undefined],
            skipLines: 6
        })
        .on('error', () => {
            fs.unlinkSync(req.file.path);   // remove temp file
            res.status(400);
            res.json({
                message: CSV_FORMAT_ERROR_MSG
            });
        })
        .on("data", data => {
            fileRows.push(data);
        })
        .on("end", () => {
            console.log(fileRows);
            fs.unlinkSync(req.file.path);   // remove temp file

            // create individual students in the db

            // create a period out of the student array
            res.sendStatus(200);
        })
    res.status(400);
    res.json({
        message: SERVER_ERROR_MSG
    });
})

// router.get("/auth/email/validate/:emailID", async (req, res) => {
//     var emailID = req.params.emailID; 
//     console.log(emailID); 
//     res.sendStatus(200); 
// })
module.exports = router;