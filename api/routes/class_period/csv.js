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

/**
 * Parse csv file to save all students into the database and create a period
 * Return the period with students array in the response body
 */
router.post("/upload", filesMulter.single('file'), async (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);

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
                data._id = new ObjectId()
                students.push(data);
            })
            .on("end", () => {
                fs.unlinkSync(req.file.path);   // remove temp file

                // create and save period to user
                const period = createPeriod(students);
                savePeriodToUser(period._id, userPayload.sub);

                res.status(200);
                res.json({
                    period: period
                });
            })
    } catch (err) {
        console.log(err);
        error.sendError(res, 404, "huh");
    }
})

/**
 * create a csv file of students and their behaviors with counts of each behavior
 */
 router.post("/download", (req, res) => {
    try {
        //const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
        console.log("creating csv file");
        var data = ["hiasdfasdf","bye"];

        //EXPECTATION - READS IN A JSON and converts to CSV 
        var ws = fs.createWriteStream(__dirname + '/test.csv');
        csv.
            write([data],{headers:true}).pipe(ws); 


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
 const createPeriod = (students) => {
    const period = {
        columns: 6,
        students: students
    }

    mongo.insertOne("periods", period)
        .then(data => {
            if (!data) {
                error.sendError(res, 500, SERVER_ERROR_MSG);
            }
        });

    return period
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