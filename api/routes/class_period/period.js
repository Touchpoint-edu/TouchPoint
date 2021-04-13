const express = require("express")
const verify = require('../../scripts/verify');
const error = require('../../scripts/error')
const mongo = require('../../models/mongo')
var ObjectId = require('mongodb').ObjectID;

const router = express.Router();

router.get("/retrieve-all", (req, res) => {
  try {
      const userPayload = verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
      const query = {
        _id: new ObjectId(userPayload.sub)
      }
      const options = {
        projection: {
          periods: 1,
          _id: 0
        }
      }
      mongo.findOne("users", query, options)
      .then(data=>{
        if(!data){
          console.log("err");
        }
        else{
          console.log(data);
          res.send(data);
        }
      })
  } catch (err) {
      console.log(err);
      error.sendError(res, 404, "huh");
  }
})

module.exports = router;