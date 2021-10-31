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

const MONGO_DB_URI="mongodb+srv://tp_user:sNuxkqXZ0jzTbZaR@cluster0.5vnfm.mongodb.net/touchpoint?retryWrites=true&w=majority"
const JWT_LOGIN_SECRET="ae280b2d0d3e3ca11caa15e3ba7ea172"
const JWT_VERIFY_SECRET="12d1c4dbfca93914dd8d9a3860115736]"
const EMAIL_USERNAME="touchpoint.devteam@gmail.com"
const EMAIL_PASSWORD="TP_dev401!"
const TOUCHPOINT_ENVIRONMENT = "development"
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

console.log("process mongo db uri", MONGO_DB_URI);

console.log("TOUCHPOINT_ENVIRONMENT", TOUCHPOINT_ENVIRONMENT)

if(TOUCHPOINT_ENVIRONMENT === "development"){
  console.log("in local development")
  const jwtLoginSecret = JWT_LOGIN_SECRET;
  console.log("jwtloginsecret",jwtLoginSecret)
  const jwtVerifySecret = JWT_VERIFY_SECRET;
  const emailObj = {
      email: EMAIL_USERNAME,
      password: EMAIL_PASSWORD
  }
  
  app.use(function(req, res, next) {
      req.jwtLoginSecret = jwtLoginSecret;
      req.jwtVerifySecret = jwtVerifySecret;
      req.emailCredentials = emailObj;
      next();
  });
  
  
  mongo.connect(MONGO_DB_URI, async function(err) {
          //Add routes here
          if (err) {
            console.log("throwing error inside mongo connect");
            throw err;
          }
          app.use("/test", testRouter);
          app.use("/api/auth", authRouter);
          app.use("/api/period", classPeriodRouter);
          app.use("/api/behavior", behaviorRouter); 
      });
  
  module.exports = app;
}
else{
  console.log("in production")
  const dbName = 'touchpoint';
  const dbUriSecretName = "projects/903480499371/secrets/MONGO_DB_URI/versions/latest";
  const jwtLoginSecretName = "projects/903480499371/secrets/JWT_LOGIN_SECRET/versions/latest";
  const jwtVerifySecretName = "projects/903480499371/secrets/JWT_VERIFY_SECRET/versions/latest";
  const emailCredentialsSecretName = "projects/903480499371/secrets/EMAIL_USERNAME/versions/latest";
  const emailCredentialsSecretPassword = "projects/903480499371/secrets/EMAIL_PASSWORD/versions/latest";
  const secretManager = new SecretManagerServiceClient();
  async function getSecret(name) {
    const [version] = await secretManager.accessSecretVersion({
      name: name,
    });

    const payload = version.payload.data.toString();
    return payload;
  }


  getSecret(dbUriSecretName).then(async (secret) => {
      const jwtLoginSecret = await getSecret(jwtLoginSecretName);
      const jwtVerifySecret = await getSecret(jwtVerifySecretName);
      // const emailCredentials = await getSecret(emailCredentialsSecretName);
      const emailObj = {
          email: await getSecret(emailCredentialsSecretName),
          password: await getSecret(emailCredentialsSecretPassword)
      }
      app.use(function(req, res, next) {
          req.jwtLoginSecret = jwtLoginSecret;
          req.jwtVerifySecret = jwtVerifySecret;
          req.emailCredentials = emailObj;
          next();
      });
      mongo.connect(secret, async function(err) {
          //Add routes here
          if (err) throw err;
          app.use("/test", testRouter);
          app.use("/api/auth", authRouter);
          app.use("/api/period", classPeriodRouter);
          app.use("/api/behavior", behaviorRouter); 
      });
  });
  // put in the uri here haha


  module.exports = app;
}
