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
        console.log(req.body.period);
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
                const period = createPeriod(students, userPayload.sub, currRow);
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
 router.get("/download", (req, res) => {
    try {
        const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);

        // download

        res.sendStatus(200);

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
 const createPeriod = (students, id, rowNum) => {
    const period = {
        rows: rowNum,
        columns: DEFAULT_COL_SIZE,
        user_id: new ObjectId(id),
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