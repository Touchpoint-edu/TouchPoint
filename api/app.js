var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');

var testRouter = require("./routes/test");
var loginRouter = require("./routes/login");
var signupRouter = require("./routes/signup");
let periodRouter = require("./routes/period");
var mongo = require('./models/mongo');
let mongoose = require('./models/mongoose');
var emailRouter = require("./routes/email_verification");
var csvRouter = require("./routes/csv_upload"); 

// const multer = require('multer');
// const csv = require('fast-csv');

// var csv_router = express.Router();

// const upload = multer({ dest: 'tmp/csv/' });

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

mongoose.connect(process.env.MONGO_DB_URI, function(err){
  app.use("/api/period", periodRouter);
});



// csv_router.post("/", upload.single('file'), async (req, res) => {
//     console.log("hello?")
//     // console.log(req.file)
//     // console.log(req.body)

//     const fileRows = [];
//     csv.fromPath(req.file.path)
//       .on("data", function (data) {
//         fileRows.push(data); // push each row
//       })
//       .on("end", function () {
//         console.log(fileRows) //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
//         fs.unlinkSync(req.file.path);   // remove temp file
//         //process "fileRows" and respond
//       })

//       console.log(fileRows);


//     //iterates through json file
//     // console.log("parsing student names");
//     // var file = req.body; 
//     // //console.log(file);
//     // for(var i = 5; i < file.length; i++) {
//     //     var obj = file[i];
//     //     console.log(obj.FIELD2); 

//     // }
//     res.sendStatus(200);
// })

// app.use('/upload-csv', csv_router);


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
