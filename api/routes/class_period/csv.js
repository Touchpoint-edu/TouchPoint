var express = require("express")
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const mongo = require('../../models/mongo');
const verify = require('../../scripts/verify')
const error = require('../../scripts/error')
const { CSV_FORMAT_ERROR_MSG, SERVER_ERROR_MSG } = require('../../constants/errors');
const errorMsg = require('../../constants/errors')

var router = express.Router();
const filesMulter = multer({ dest: 'csv/' });

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
 * Parse csv file to save all students into the database and create a period
 * Return the period with students array in the response body
 */
router.post("/upload", filesMulter.single('file'), async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY ,res);
        let currRow = 0, currCol = 0;
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
                data._id = new ObjectId();
                data.row = currRow;
                data.col = currCol;
                currCol++;
                if (currCol >= 6) {
                    currRow++;
                    currCol = 0;
                }
                students.push(data);
            })
            .on("end", () => {
                fs.unlinkSync(req.file.path);   // remove temp file

                const period = {
                        rows: currRow + 1,
                        columns: DEFAULT_COL_SIZE,
                        students: students,
                        periodNum: parseInt(req.body.period)
                }

                res.status(200);
                res.json({ period: period });

            })
    } catch (err) {
        console.log(err);
        error.sendError(res, 500, errorMsg.SERVER_ERROR_MSG);
    }
})

/**
 * create a csv file of students and their behaviors with counts of each behavior
 */
 router.post("/download",async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY, res);
        var start = req.body["start"] ? req.body["start"] : 0;
        var end = req.body["end"] ? req.body["end"] : 1620012831; 
        var students = req.body["students"];
          
        var arrayLength = students.length;
        var arr = [];
        for (var i = 0; i < arrayLength; i++) {
            studentEmail = students[i].email
            studName = students[i].name
            const query2 = {
                email: studentEmail
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
            for(let i = 0; i < studentBehaviorArray.length; i++){
                let arrayTime = studentBehaviorArray[i]["time"]
                if(arrayTime > start && arrayTime < end){
                    let behaviorName = studentBehaviorArray[i]["name"]
                    if(studentObj[behaviorName]){
                        studentObj[behaviorName] = studentObj[behaviorName] + 1;
                    }
                    else{
                        studentObj[behaviorName] = 1;
                    }
                }
            }
            arr.push(studentObj)
        }
        //EXPECTATION - READS IN A JSON and converts to CSV 

        var ws = fs.createWriteStream(__dirname + '/test.csv')
            .on('data', () => console.log("writing"))
            .on("end", () => console.log("write done"))

        csv
            .write(arr,{headers: headersArray}).pipe(ws)
            .on('finish', ()=>{
                console.log("done with csv")
                const file = `${__dirname}/test.csv`
                var filestream = fs.createReadStream(file);
                filestream.pipe(res);
            }) 
            .on('open', function(){
                console.log("Writing out csv file")

            })
    } catch (err) {
        console.log(err);
        error.sendError(res, 500, SERVER_ERROR_MSG);
    }
})

/* ************************************** HELPERS ************************************* */

/**
 *  create a period containing the students array
 * @param {*} students : array of students
 * @returns the period created in the db
 */
const createPeriod = (students, id, rowNum, periodNum) => {
    const period = {
        $set: {
            rows: rowNum + 1,
            columns: DEFAULT_COL_SIZE,
            user_id: new ObjectId(id),
            students: students,
            periodNum: periodNum
        }
    }
    const query = {
        user_id: new ObjectId(id),
        periodNum:
            periodNum
    }
    const options = {
        upsert: true
    }
    return mongo.update("periods", query, period, options);
}

/**
 * save period to users document
 * @param {*} period_id : period id in db
 * @param {*} user_id : user id to save period to
 */
const savePeriodToUser = (period_id, user_id) => {
    const query = {
        _id: new ObjectId(user_id)
    }
    const update = {
        $push: { "periods": period_id }
    }
    const options = { upsert: true };

    mongo.update("users", query, update, options)
        .then(data => {
            if (!data) {
                error.sendError(res, 500, SERVER_ERROR_MSG);
            }
        })
}

module.exports = router;