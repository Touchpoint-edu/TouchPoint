var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');



var testRouter = require("./routes/test");
var loginRouter = require("./routes/login");
var signupRouter = require("./routes/signup");
let periodRouter = require("./routes/period");
var mongo = require('./models/mongo');
let mongoose = require('./models/mongoose');
var emailRouter = require("./routes/email_verification");
var csvRouter = require("./routes/csv_upload"); 

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

// mongoose.connect(process.env.MONGO_DB_URI, function(err){
//   app.use("/api/period", periodRouter);
// });
const dbName = 'touchpoint';

// Create a new MongoClient
const client = new MongoClient(process.env.MONGO_DB_URI);



// put in the uri here haha
mongo.connect(process.env.MONGO_DB_URI, function(err) {
    //Add routes here
    app.use("/test", testRouter);
    app.use("/api/login", loginRouter);
    app.use("/api/signup", signupRouter);
    app.use("/api/email_verification", emailRouter); 
    app.use("/period/csv", csvRouter); 
});


// Terry's useless code
// app.get('/getTest', (req,res) =>{
//   res.send("TERRY WAS HERE EXPRESS AND REACT CONNECT");
//   console.log("Send test to React App");
// });

// Also Terry's useless code
// app.get('/', function(req, res){
//   res.sendFile(__dirname + "/views/index.html");
// });





// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



module.exports = app;
