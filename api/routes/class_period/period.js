const express = require("express")
const verify = require('../../scripts/verify');
const error = require('../../scripts/error')
const mongo = require('../../models/mongo')
var ObjectId = require('mongodb').ObjectID;
const errorMsg = require('../../constants/errors')

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const userPayload = verify.verify(req.cookies.c_user, req.jwtLoginSecret);
<<<<<<< HEAD
=======
    
    const period = {
      $set: {
        rows: req.body.period.rows,
        columns: req.body.period.columns,
        user_id: new ObjectId(userPayload.sub),
        students: req.body.period.students,
        periodNum: parseInt(req.body.period.periodNum)
      }
    }
>>>>>>> develop

    const query = {
      user_id: new ObjectId(userPayload.sub),
      periodNum:
        period.periodNum
    }
    const options = {
      upsert: true
    }
    mongo.update("periods", query, period, options)
      .then((result, err) => {
        if (err) {
          error.sendError(res, 500, SERVER_ERROR_MSG);
        }
        else {
          res.sendStatus(200);
        }
      });
  } catch (err) {
    console.log(err);
    error.sendError(res, 404, "huh");
  }
})

router.get("/retrieve-all", async (req, res) => {
  try {
    const userPayload = verify.verify(req.cookies.c_user, req.jwtLoginSecret);
    const query = {
      user_id: new ObjectId(userPayload.sub)
    }
    const options = {
      projection: {
        user_id: 0
      }
    }
    const arr = [];
    const cursor = mongo.findMany("periods", query, options);
    cursor.hasNext((err, hasNext) => {
      if (hasNext) {
        cursor.toArray((err, arr) => {
          res.send(arr);
        });
      }
      else {
        res.send(arr);
      }
    })
  } catch (err) {
    console.log(err);
    error.sendError(res, 500, errorMsg.SERVER_ERROR_MSG);
  }
})

module.exports = router;