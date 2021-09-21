var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var dotenv = require('dotenv');
var MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const {SecretManagerServiceClient} = require('@google-cloud/secret-manager');
var testRouter = require("./routes/test");


var mongo = require('./models/mongo');
const authRouter = require("./routes/auth/controller")
const classPeriodRouter = require("./routes/class_period/controller")

var behaviorRouter = require("./routes/behavior"); 
const { access } = require('fs');

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
const dbUriSecretName = "/projects/903480499371/secrets/db-uri/versions/latest";
const jwtLoginSecretName = "/projects/903480499371/secrets/jwt-login-key/versions/latest";
const jwtVerifySecretName = "/projects/903480499371/secrets/jwt-verify-key/versions/latest";
const emailCredentialsSecretName = "/projects/903480499371/secrets/email-verification-credentials/versions/latest";
const secretManager = new SecretManagerServiceClient();

//hardcoded
const jwtLoginSecret = "ae280b2d0d3e3ca11caa15e3ba7ea172";
console.log("jwtloginsecret",jwtLoginSecret)
const jwtVerifySecret = "12d1c4dbfca93914dd8d9a3860115736";
const emailCredentials = "touchpoint.devteam@gmail.com:TP_dev401";
const emailObj = {
    email: emailCredentials.split(':')[0],
    password: emailCredentials.split(':')[1]
}

app.use(function(req, res, next) {
    req.jwtLoginSecret = jwtLoginSecret;
    req.jwtVerifySecret = jwtVerifySecret;
    req.emailCredentials = emailObj;
    console.log("req",req.jwtLoginSecret)

    next();
    console.log("inside app.use");

});

console.log("outside everything");

mongo.connect("mongodb+srv://tp_user:rxZPvezy5OvGRwAE@cluster0.5vnfm.mongodb.net/touchpoint?retryWrites=true&w=majority", async function(err) {
        //Add routes here
        if (err) {
          console.log("throwing error inside mongo connect");
          throw err;
        }
        app.use("/test", testRouter);
        app.use("/api/auth", authRouter);
        app.use("/api/period", classPeriodRouter);
        app.use("/api/behavior", behaviorRouter); 
        console.log("end of mongo connect");
    });

module.exports = app;
/*
async function getSecret(name) {
    console.log("get secret1")
    const [version] = await secretManager.accessSecretVersion({ //stuck here
      name: name,
    });
    console.log("get secret2")

    const payload = version.payload.data.toString();
    console.log("get secret3")
    console.log(payload)
    return payload;
  }

getSecret(dbUriSecretName).then(async (secret) => {
    console.log("inside get secret");

    const jwtLoginSecret = await getSecret(jwtLoginSecretName);
    console.log("jwtloginsecret",jwtLoginSecret)
    const jwtVerifySecret = await getSecret(jwtVerifySecretName);
    const emailCredentials = await getSecret(emailCredentialsSecretName);
    const emailObj = {
        email: emailCredentials.split(':')[0],
        password: emailCredentials.split(':')[1]
    }
    app.use(function(req, res, next) {
        req.jwtLoginSecret = jwtLoginSecret;
        req.jwtVerifySecret = jwtVerifySecret;
        req.emailCredentials = emailObj;
        next();
    });
    
    console.log("inside get secret outside mongo connect");

    mongo.connect("mongodb+srv://tp_user:rxZPvezy5OvGRwAE@cluster0.5vnfm.mongodb.net/touchpoint?retryWrites=true&w=majority", async function(err) {
        //Add routes here
        if (err) {
          console.log("throwing error inside mongo connect");
          throw err;
        }
        app.use("/test", testRouter);
        app.use("/api/auth", authRouter);
        app.use("/api/period", classPeriodRouter);
        app.use("/api/behavior", behaviorRouter); 
        console.log("end of mongo connect");
    });
});*/
// put in the uri here haha


