var express = require("express")
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var morgan  = require('morgan');
const mongoose = require('mongoose');
const period = require('../models/period')

//Set up default mongoose connection
module.exports = router;

router.get("/students/update", function(req, res) {
    period.findByIdAndUpdate(req.body.period_id, req.body.period, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

//Update Query
router.get("/students/update/:period_id", function(req, res) {
    period.findByIdAndUpdate(req.params['period_id'], req.body, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
});

router.get("/students/create", function(req,res) {
  const per = new period({
    students:[
      {
        student_id: 0,
        name: "Meow"
      }
    ]
  });
  // const per = new period(req.body);
  per.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) =>{
      console.log(err);
    });
});

router.get("/students/seating/:period_id", function(req,res) {
  period.findById(req.params['period_id'])
    .then((results) =>{
      res.send(results);
    })
    .catch((err) =>{
      console.log(err);
    })
});
