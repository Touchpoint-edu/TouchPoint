var express = require("express")
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var morgan  = require('morgan');
const mongoose = require('mongoose');
const period = require('../models/period')

//Static cause no performance benefit to not being Static
function verify(callback){
  try{
    const decoded = jwt.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
    callback();
  }
  catch(err){
    console.log(err);
  }
}

//async verify test

router.get("/students/update", async function(req, res) {
  try{
    const decoded = jwt.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
    period.findByIdAndUpdate(req.body.period_id, req.body.period, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
  catch(err){
    console.log(err);
  }


});

//Update Query
router.get("/students/update/:period_id", function(req, res) {
  try{
    const decoded = jwt.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
    period.findByIdAndUpdate(req.params['period_id'], req.body, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
  catch(err){
    console.log(err);
  }
});

router.get("/students/create", function(req,res) {
    try{
      const decoded = jwt.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
      const per = new period(req.body);
      // const per = new period(req.body);
      per.save()
        .then((result) => {
          res.send(result)
        })
        .catch((err) =>{
          console.log(err);
        });
    }
    catch(err){
      console.log(err);
    }

});

router.get("/students/seating/:period_id", function(req,res) {

    try{
      const decoded = jwt.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
      period.findById(req.params['period_id'])
        .then((results) =>{
          res.send(results);
        })
        .catch((err) =>{
          console.log(err);
        });
    }
    catch(err){
      console.log(err);
    }
});

module.exports = router;
