var express = require("express")
var ObjectId = require('mongodb').ObjectID;
const multer = require('multer');
const csv = require('fast-csv');
const fs = require('fs');

const mongo = require('../../models/mongo');
const verify = require('../../scripts/verify')
const error = require('../../scripts/error')
const { CSV_FORMAT_ERROR_MSG, SERVER_ERROR_MSG } = require('../../constants/errors');

var router = express.Router();
const filesMulter = multer({ dest: 'csv/' });

const DEFAULT_COL_SIZE = 6;

/**
 * Parse csv file to save all students into the database and create a period
 * Return the period with students array in the response body
 */
router.post("/upload", filesMulter.single('file'), async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
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

                // create and save period to user
                createPeriod(students, userPayload.sub, currRow, parseInt(req.body.period)).then((result, err) => {
                    if (err) {
                        error.sendError(res, 500, SERVER_ERROR_MSG);
                    }
                    else {
                        res.sendStatus(200);
                    }
                });
                // savePeriodToUser(period._id, userPayload.sub);
            })
    } catch (err) {
        console.log(err);
        error.sendError(res, 404, "huh");
    }
})

/**
 * create a csv file of students and their behaviors with counts of each behavior
 */
 router.post("/download",async (req, res) => {
    try {
        //const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
        /*
        
        607bf7d8dcfbdfeeed4d8c51
        
        */
        console.log(req.body); 
        var period = "607bf7d8dcfbdfeeed4d8c51"; 
        const query = {
            _id: new ObjectId(period)
          }
        let student_data = await mongo.findOne("periods", query);
          
        //console.log(student_data); 
        students = student_data.students;
        var arrayLength = students.length;
        var arr = [];
        for (var i = 0; i < arrayLength; i++) {
            //console.log(students[i]);
            //Do something
            stud = students[i]._id;
            const query2 = {
                student_id: new ObjectId(stud)
              }
            //let student_data = await mongo.findMany("behaviors", query2);
            //console.log(student_data);
            
            const cursor = await mongo.findMany("behaviors", query2);
            await cursor.forEach(( myDoc )=> {
                arr.push(myDoc);
            
            }) 
        }
        console.log("creating csv file");
        //var data = [["student name","bye"],[1,2]];
        data = arr; 
        csv_data = [{
            "google_id":[1,2,3,4],
            "name":[5,6,7,8]
            //"behaviors":[["hello"]]
        },{
            "google_id":[11,12,13,14],
            "hello":[15,16,17,18]
        }];
        console.log(csv_data); 
        //console.log(data);
        //EXPECTATION - READS IN A JSON and converts to CSV 
        var ws = fs.createWriteStream(__dirname + '/test.csv');
        csv.
            write(csv_data,{headers:true}).pipe(ws); 


        const file = `${__dirname}/test.csv`
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);

    } catch (err) {
        console.log(err);
        error.sendError(res, 404, "huh");
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
            rows: rowNum+1,
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