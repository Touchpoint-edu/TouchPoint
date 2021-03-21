var express = require("express")
const mongoose = require('mongoose');
var mongo = require('../models/mongo');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const { CSV_FORMAT_ERROR_MSG } = require('../constants/errors');

var router = express.Router();
const filesMulter = multer({ dest: 'csv/' });

/**
 * Parse csv file to save all students into the database and create a period
 * Return the period with students array in the response body
 */
router.post("/upload", filesMulter.single('file'), async (req, res) => {
    // array of students (row = student, cols = name, email)
    const students = [];

    csv.parseFile(req.file.path,
        {
            headers: [undefined, 'name', 'email', undefined],
            skipLines: 6
        })
        .on("error", () => {
            fs.unlinkSync(req.file.path);   // remove temp file
            res.status(400);
            res.json({
                message: CSV_FORMAT_ERROR_MSG
            });
        })
        .on("data", data => {
            students.push(data);
        })
        .on("end", () => {
            fs.unlinkSync(req.file.path);   // remove temp file

            // create individual students in the db
            mongo.insertMany("students", students);

            const period = {
                columns: 6,
                students: students
            }

            // create a period containing the student array
            mongo.insertOne("periods", period)

            res.status(200);
            res.json({
                period: period
            });
        })
})

// router.get("/auth/email/validate/:emailID", async (req, res) => {
//     var emailID = req.params.emailID; 
//     console.log(emailID); 
//     res.sendStatus(200); 
// })
module.exports = router;