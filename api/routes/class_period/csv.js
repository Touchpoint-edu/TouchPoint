var express = require("express")
var ObjectId = require('mongodb').ObjectID;
const csv = require('fast-csv');
const fs = require('fs');
const os = require('os')

const mongo = require('../../models/mongo');
const verify = require('../../scripts/verify')
const error = require('../../scripts/error')
const { CSV_FORMAT_ERROR_MSG, SERVER_ERROR_MSG } = require('../../constants/errors');

var router = express.Router();

const DEFAULT_COL_SIZE = 6;

//HARD CODED CSV HEADERS ADD HERE TO ADD COLUMNS
var headersArray = [
    "google_id",
    "name",
    "Relevant Question",
    "Relevant Answer",
    "Quality Discussion",
    "Focused Work",
    "Paying Attention",
    "Focused Reading",
    "Note Taking",
    "Group Work",
    "Gaming",
    "Talking",
    "Cell Phone",
    "Noise Making",
    "Out of Seat",
    "Withdrawn",
    "Quiet",
    "Angry",
    "Sarcastic",
    "Instigating Others",
    "Attention Seeking",
];

/**
 * Parse file (which is an array of arrays aka rows of columns) for students
 * Saves the period to the database
 */
router.post("/upload", async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
        let file = req.body.uploadFile;        

        let currRow = 0, currCol = 0;
        let students = [];

        // detect if there is a new line at the end of the file and remove it (happens on windows when an excel is saved as a csv)
        if(file[file.length-1].length === 1){
            file.splice(file.length-1, 1);
        }

        // find where the student list starts
        // assumes it starts after the row with 
        // "Grade, First Name, GoogleID, SchoolName" headers
        let startIndex = -1;
        for (let i = 0; i < file.length; i++) {
            if (file[i][0] === "Grade" || file[i][0] === "grade") {
                startIndex = i + 1;
                break;
            }
        }

        // couldn't find where the student list starts
        if (startIndex === -1) {
            error.sendError(res, 400, CSV_FORMAT_ERROR_MSG)
            console.log("couldn't find where the student list starts")
            return
        }

        // parse the file for students and append it to the students array
        // assumes student name is in second column and email is in third
        for (let i = startIndex; i < file.length; i++) {
            // file format error
            if (file[i].length != 4) {
                error.sendError(res, 400, CSV_FORMAT_ERROR_MSG)
                console.log("There are not exactly 4 columns")
                return
            }

            let student = {
                name: file[i][1],
                email: file[i][2],
                row: currRow,
                col: currCol,
            }

            currCol++;
            if (currCol >= 6) {
                currRow++;
                currCol = 0;
            }

            students.push(student);
        }

        // add period to database
        const period = {
            $set: {
                rows: currRow + 1,
                columns: DEFAULT_COL_SIZE,
                students: students,
                periodNum: parseInt(req.body.period),
                user_id: new ObjectId(userPayload.sub),
            }
        }
        const query = {
            user_id: period.$set.user_id,
            periodNum: period.$set.periodNum
        }
        const options = {
            upsert: true
        }
        mongo.update("periods", query, period, options)
            .then((result, err) => {
                if (err) {
                    error.sendError(res, 500, SERVER_ERROR_MSG);
                } else {
                    res.sendStatus(200);
                }
            });
    } catch (err) {
        console.log(err);
        error.sendError(res, 500, SERVER_ERROR_MSG);
    }
})

/**
 * create a csv file of students and their behaviors with counts of each behavior
 */
router.post("/download", async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
        
        var start = req.body["start"] ? req.body["start"] : 0;
        var end = req.body["end"] ? req.body["end"] + 86400 : 0; // add 86400 so we can be inclusive for today
        var students = req.body["students"];

        var arrayLength = students.length;
        var arr = [];
        console.log(req.body)
        for (var i = 0; i < arrayLength; i++) {
            studentEmail = students[i].email
            studName = students[i].name
            const query2 = {
                email: studentEmail,
                period_id: new ObjectId(req.body["period"])
            }
            const cursor = await mongo.findMany("behaviors", query2);

            //Creates a student object
            //As we iterate we find more behaviors and add it to student object
            let studentObj = {}
            //*****Here Set google_id can be set to anything right now its email********* */
            studentObj["google_id"] = studentEmail
            studentObj["name"] = studName
            let studentBehaviorArray = await cursor.toArray();

            //Go thbrough all beavhiors
            for (let i = 0; i < studentBehaviorArray.length; i++) {
                let arrayTime = studentBehaviorArray[i]["time"]
                if (arrayTime > start && arrayTime < end) {
                    let behaviorName = studentBehaviorArray[i]["name"]
                    if (studentObj[behaviorName]) {
                        studentObj[behaviorName] = studentObj[behaviorName] + 1;
                    }
                    else {
                        studentObj[behaviorName] = 1;
                    }
                }
            }
            arr.push(studentObj)
        }
        //EXPECTATION - READS IN A JSON and converts to CSV 

        var ws = fs.createWriteStream(os.tmpdir() + `/${req.cookies.c_user}.csv`)
            .on('data', () => console.log("writing"))
            .on("end", () => console.log("write done"))

        csv
            .write(arr, { headers: headersArray }).pipe(ws)
            .on('finish', () => {
                console.log("done with csv")
                const file = os.tmpdir() + `/${req.cookies.c_user}.csv`
                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
                filestream.on('end', () => {
                    const path = os.tmpdir() + `/${req.cookies.c_user}.csv`
                    fs.unlink(path ,(err =>{
                        if(err){
                            console.error(err)
                        }
                    }))
                    console.log("delete temp file")
                })

            })
            .on('open', function () {
                console.log("Writing out csv file")

            })
    } catch (err) {
        console.log(err);
        error.sendError(res, 500, SERVER_ERROR_MSG);
    }
})

module.exports = router;