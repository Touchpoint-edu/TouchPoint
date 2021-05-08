var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var testRouter = require("./routes/test");


var mongo = require('./models/mongo');
const authRouter = require("./routes/auth/controller")
const classPeriodRouter = require("./routes/class_period/controller")

var behaviorRouter = require("./routes/behavior"); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client/build')));

//PLAY AROUND HERE
dotenv.config();

console.log(process.env.MONGO_DB_URI);

const dbName = 'touchpoint';

// Create a new MongoClient
const client = new MongoClient(process.env.MONGO_DB_URI);



// put in the uri here haha
mongo.connect(process.env.MONGO_DB_URI, function(err) {
    //Add routes here
    if (err) throw err;
    app.use("/test", testRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/period", classPeriodRouter);
    app.use("/api/behavior", behaviorRouter); 
});


module.exports = app;
