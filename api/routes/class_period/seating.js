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
const errorMsg = require('../../constants/errors')
const { SERVER_ERROR_MSG } = require('../../constants/errors');

/**
Given a period id, updates the period i.e overrides everything
*/
router.post("/update/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
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
        if(!data){
          //Note not sure if this ever will get called, if it cant find it will still return data
          error.sendError(res, "500", errorMsg.UPDATE_PERIOD_ERROR_MSG);
        }
        //if no results found
        else if(data.result.n <= 0){
          error.sendError(res, "500", errorMsg.PERIOD_NOT_FOUND_ERROR_MSG);
        }
        else{ 
          res.sendStatus(200);
        }
    })
  }catch(err){
    console.log(err);
    error.sendError(res, "500", errorMsg.UPDATE_PERIOD_ERROR_MSG);
  }
});

/**
Given a period id, returns the entire seating chart response
*/
router.get("/seating/:period_id", function(req,res) {
    try{
      verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
      const query = {
        _id: new ObjectId(req.params['period_id'])
      }
      mongo.findOne("periods", query)
      .then(data=>{
        if(!data){
          error.sendError(res, "500", errorMsg.PERIOD_NO_RETURN_ERROR_MSG);
        }
        else{
          console.log(data);
          res.send(data);
        }
      })
    }
    catch(err){
      console.log(err);
      error.sendError(res, "500", errorMsg.PERIOD_NO_RETURN_ERROR_MSG);
    }
});

/**
Given a period id, adds a single student
*/
router.post("/add-one/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
    req.body._id = new ObjectId(); //If you need a new object id
    const query = {
      _id: new ObjectId(req.params['period_id'])
    }
    const update = {
      $push: { "students" : req.body }
    }
    const options = { upsert: false };
    mongo.update("periods", query, update, options)
    .then(data =>{
        if(!data){
          error.sendError(res, "500", errorMsg.UPDATE_STUDENT_ERROR_MSG);
        }
        //if no results found
        else if(data.result.n <= 0){
          error.sendError(res, "500", errorMsg.PERIOD_NOT_FOUND_ERROR_MSG);
        }
        else {
          res.status(200);
          res.json(req.body._id)
        }
    })
  }
  catch(err){
    console.log(err);
    error.sendError(res, "500", errorMsg.UPDATE_STUDENT_ERROR_MSG);
  }
});

/**
Given a period id, and student email to remove, deletes a student
*/
router.delete("/remove-one/:period_id", function(req,res){
  try{
    verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);
    const query = {
      _id: new ObjectId(req.params['period_id'])
      //_id: req.params['period_id']
    }
    console.log(req.params['period_id']);
    const update = {
      $pull: { "students" : req.body }
      //pull : {"student" : req.body.email}
    }
    const options = { upsert: false };
    mongo.update("periods", query, update, options)
    .then(data =>{
        if(!data){
          console.log('update student error when trying to delete student');
          error.sendError(res, "500", errorMsg.UPDATE_STUDENT_ERROR_MSG);
        }
        else if(data.result.n <= 0){
          console.log('period not found when deleting student');
          error.sendError(res, "500", errorMsg.PERIOD_NOT_FOUND_ERROR_MSG);
        }
        else{
          res.sendStatus(200);
        }
    })
  }
  catch(err){
    console.log('delete catch block');
    console.log(err);
    error.sendError(res, "500", errorMsg.DELETE_STUDENT_FROM_PERIOD_ERROR_MSG);
  }
});


module.exports = router;
