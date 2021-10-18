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
const dbUriSecretName = "projects/903480499371/secrets/db-uri/versions/latest";
const jwtLoginSecretName = "projects/903480499371/secrets/jwt-login-key/versions/latest";
const jwtVerifySecretName = "projects/903480499371/secrets/jwt-verify-key/versions/latest";
const emailCredentialsSecretName = "projects/903480499371/secrets/email-verification-credentials/versions/latest";
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