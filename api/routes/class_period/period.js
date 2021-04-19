const express = require("express")
const verify = require('../../scripts/verify');
const error = require('../../scripts/error')
const mongo = require('../../models/mongo')
var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

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
      error.sendError(res, 404, "huh");
  }
})

module.exports = router;