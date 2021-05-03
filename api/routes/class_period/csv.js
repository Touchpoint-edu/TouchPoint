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

function createCSV() {
    
    
}

/**
 * create a csv file of students and their behaviors with counts of each behavior
 */
 router.get("/download", (req, res) => {
    try {


        console.log("creating csv file");
        var data = ["hiasdfasdf","bye"];

        //EXPECTATION - READS IN A JSON and converts to CSV 
        var ws = fs.createWriteStream(__dirname + '/test.csv');
        csv.
            write([data],{headers:true}).pipe(ws); 


        const file = `${__dirname}/test.csv`
        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
        //const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
        // if(req.body.date == ""){
        //     //case1 download all data for period 
        // }else{
        //     //case2 download info for specific date range 
        //     // start = req.body.start; 
        //     // end = req.body.end; 
        // }
        // download
        //var data = ["hi","bye"]; 
        //'form-tracking/formList.csv', dataToWrite, 'utf8'
        //var ws = fs.writeFileSync(__dirname + '/test.csv',data,'utf8');
        //csv.
        //    write([data],{headers:true}).pipe(ws);

       //data = "hello i am changing the file\n";
        // fs.writeFile(__dirname + '/student_data.txt', data, function (err){
        //     if (err) return console.log(err);
        // });
        
        //console.log(`${__dirname}`);
        // var filepath = "";
        // var filename = "student_data.txt";
        // console.log("help");
        // fs.readFile(__dirname + '/student_data.txt', 'utf8' , (err, data) => {
        //     if (err) {
        //       console.error(err)
        //       return
        //     }
        //     console.log(data)
        //   });
        
        //res.setHeader('Content-type','text/csv');
        // //res.send("views/email_template.html");
        //res.sendStatus(200); 
        //res.setHeader("Content-Disposition", "attachment; test.csv");
        //res.sendFile(__dirname +"/test.csv");
        //res.download(file);
        //res.attachment('test.csv').send(csv)
        //res.status(200);

        
        
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