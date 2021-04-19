var express = require("express")
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var morgan  = require('morgan');
var ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');
const period = require('../../models/period')
const verify = require('../../scripts/verify')
const error = require('../../scripts/error')
const mongo = require('../../models/mongo')
const { SERVER_ERROR_MSG } = require('../../constants/errors');

/**
Given a period id, updates the period
*/
router.post("/update/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
    const query = {
      _id: new ObjectId(req.params['period_id'])
    }
    const update = {
      $set: {
        rows: req.body.rows,
        columns: req.body.columns,
        students: req.body.students
      }
    }
    mongo.update("periods", query, update)
    .then(data =>{
        if(!data){ // TODO: COULDN'T FIND PERIOD **************************************************************************
          console.log("err");
        }
        else{ //  TODO: EVEN IF IT DOESN'T CHANGE ANYTHING, DATA WILL SAY THAT IT DIDN'T FIND, NEED TO CHECK
          res.sendStatus(200);
        }
    })
  }catch(err){
    console.log(err);
    error.sendError(res, "404", "huh");
  }
});

/**
Given a period id, returns the entire seating chart response
*/
router.get("/seating/:period_id", function(req,res) {
    try{
      verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
      const query = {
        _id: new ObjectId(req.params['period_id'])
      }
      mongo.findOne("periods", query)
      .then(data=>{
        if(!data){
          console.log("err");
        }
        else{
          console.log(data);
          res.send(data);
        }
      })
    }
    catch(err){
      console.log(err);
      error.sendError(res, "404", "huh");
    }
});

/**
Given a period id, adds a single student
*/
router.post("/add-one/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY, res);
    req.body._id = new ObjectId(); //If you need a new object id
    const query = {
      _id: new ObjectId(req.params['period_id'])
    }
    const update = {
      $push: { "students" : req.body }
    }
    const options = { upsert: true };
    mongo.update("periods", query, update, options)
    .then(data =>{
        if(!data){
          console.log("err");
        }
        else{
          res.sendStatus(200);
        }
    })
  }
  catch(err){
    console.log(err);
    error.sendError(res, 500, SERVER_ERROR_MSG);
  }
});

//Delete
router.delete("/remove-one/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
    const query = {
      _id: new ObjectId(req.params['period_id'])
    }
    console.log(req.params['period_id']);
    const update = {
      $pull: { "students" : req.body }
    }
    const options = { upsert: false };
    mongo.update("periods", query, update, options)
    .then(data =>{
        if(!data){
          console.log("err");
        }
        else{
          res.sendStatus(200);
        }
    })
  }
  catch(err){
    console.log(err);
    error.sendError(res, "404", "huh");
  }
});


// router.get("/update", async function(req, res) {
//   try{
//     verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
//     period.findByIdAndUpdate(req.body.period_id, req.body.period, function(err, result) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     });
//   }catch(err){
//     console.log(err);
//     error.sendError(res, "404", "huh");
//   }
// });

//Update Query
// router.get("/update/:period_id", function(req, res) {
//   try{
//     verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
//     period.findByIdAndUpdate(req.params['period_id'], req.body, function(err, result) {
//       if (err) {
//         res.send(err);
//       } else {
//         res.send(result);
//       }
//     });
//   }
//   catch(err){
//     console.log(err);
//     error.sendError(res, "404", "huh");
//   }
// });

// router.get("/create", function(req,res) {
//     try{
//       verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);
//       const per = new period(req.body);
//       // const per = new period(req.body);
//       per.save()
//         .then((result) => {
//           res.send(result)
//         })
//         .catch((err) =>{
//           console.log(err);
//         });
//     }
//     catch(err){
//       console.log(err);
//       error.sendError(res, "404", "huh");
//     }
//
// });

module.exports = router;
