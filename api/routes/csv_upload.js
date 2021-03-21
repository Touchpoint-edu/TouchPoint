var express = require("express")
const mongoose = require('mongoose');
const mongo = require('../models/mongo');
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const { CSV_FORMAT_ERROR_MSG } = require('../constants/errors');
const verify = require('../scripts/verify')
const error = require('../scripts/error')

var router = express.Router();
const filesMulter = multer({ dest: 'csv/' });

/**
 * Parse csv file to save all students into the database and create a period
 * Return the period with students array in the response body
 */
router.post("/upload", filesMulter.single('file'), async (req, res) => {
    try {
        verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
        
        let students = [];
        const parseFileOptions = {
            headers: [undefined, 'name', 'email', undefined],
            skipLines: 6
        }

        csv.parseFile(req.file.path, parseFileOptions)
            .on("error", () => {
                fs.unlinkSync(req.file.path);   // remove temp file
                error.sendError(res, 400, CSV_FORMAT_ERROR_MSG)
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
    } catch (err) {
        console.log(err);
        error.sendError(res, "404", "huh");
    }
})

// router.get("/auth/email/validate/:emailID", async (req, res) => {
//     var emailID = req.params.emailID; 
//     console.log(emailID); 
//     res.sendStatus(200); 
// })
module.exports = router;