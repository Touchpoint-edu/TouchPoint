var express = require("express")
var mongo = require('../../models/mongo');
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const {google} = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];

const { INCORRECT_PASSWORD_ERROR_MSG, NO_ACCOUNT_FOUND_ERROR_MSG, PENDING_VERIFICATION_ERROR_MSG, SERVER_ERROR_MSG, USE_GOOGLE_ERROR_MSG } = require('../../constants/errors');
const { USER_PENDING_EMAIL_STATUS } = require('../../constants/status')
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = require('../../constants/config');

const JWT_EXPIRY_TIME = '1d'; // change expiry time
const JWT_COOKIE_NAME = 'c_user';
const TOKEN_PATH = 'token.json';

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

function sendToken(res, key, data) {
    const token = jwt.sign({
        sub: data._id,
        name: `${data.fname} ${data.lname}`
    }, key, {expiresIn: JWT_EXPIRY_TIME});
    res.cookie(JWT_COOKIE_NAME, token, { 
        expires: new Date(Date.now() + 900000), // change expiry time
        httpOnly: true
    });
    
    res.status(200).json({ name: `${data.fname} ${data.lname}` });
}

function sendError(res, status, message) {
    res.status(status);
    res.json({
        message: message
    });
}

function listCourses() {
    const auth = new OAuth2Client("903480499371-r4hhlvmocekr1h8igpqbstf7c75tj5uv.apps.googleusercontent.com", "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", "http://localhost:3000/");
    const classroom = google.classroom({version: 'v1', auth});
  classroom.courses.list({
    pageSize: 10,
  }, (err, res) => {
    if (err) return console.error('The API returned an error: ' + err);
    const courses = res.data.courses;
    if (courses && courses.length) {
      console.log('Courses:');
      courses.forEach((course) => {
        console.log(`${course.name} (${course.id})`);
      });
    } else {
      console.log('No courses found.');
    }
  });
}

function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    oAuth2Client.getToken("G-444591", (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
          listCourses();
        });

    // rl.question('Enter the code from that page here: ', (code) => {
    //   rl.close();
    //   oAuth2Client.getToken("G-444591", (err, token) => {
    //     if (err) return console.error('Error retrieving access token', err);
    //     oAuth2Client.setCredentials(token);
    //     // Store the token to disk for later program executions
    //     fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    //       if (err) return console.error(err);
    //       console.log('Token stored to', TOKEN_PATH);
    //       listCourses();
    //     });
    //   });
    });
  }
  

router.post("/google", async (req, res) => {
    const { token }  = req.body;
    // Verify Google Token
    client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
    })
    .then(ticket => {
        // Find google id in database
        const { sub } = ticket.getPayload();
        const options = {
            projection: {
                _id: 1,
                fname: 1,
                lname: 1,
                status: 1
            }
        }
        mongo.findUser({ google_id: sub}, options)
        .then((data) => {
            if (data == null) {
                sendError(res, 401, NO_ACCOUNT_FOUND_ERROR_MSG);
            }
            else if (data.status == USER_PENDING_EMAIL_STATUS) {
                sendError(res, 401, PENDING_VERIFICATION_ERROR_MSG);
            }
            else {
                // successfully verified google token and found in db
                //client.setCredentials(token);
                //const auth = new OAuth2Client("903480499371-r4hhlvmocekr1h8igpqbstf7c75tj5uv.apps.googleusercontent.com", "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", "http://localhost:3000/");
                //getNewToken(auth);
                //listCourses();
                sendToken(res, req.jwtLoginSecret, data);
            }
        });
    })
    .catch(error => {
        sendError(res, 500, SERVER_ERROR_MSG);
    });
})

router.post("/", async (req, res) => {
    const base64credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const options = {
        projection: {
            _id: 1,
            email: 1,
            hash: 1,
            fname: 1,
            lname: 1,
            google_id: 1,
            status: 1
        }
    }

    // find email in database
    mongo.findUser({ email: email }, options)
    .then(data => {
        if (!data) {
            sendError(res, 401, NO_ACCOUNT_FOUND_ERROR_MSG);
        }
        else if (!!data.google_id) {
            sendError(res, 401, USE_GOOGLE_ERROR_MSG);
        }
        else {
            // hash provided password and check against hash stored in database
            const [hash, salt] = data.hash.split(':');
            crypto.pbkdf2(password, Buffer.from(salt, 'hex'), 10000, 16, 'sha512', (err, derivedKey) => {
                if (err) {
                    throw err;
                }
                if (derivedKey.toString('hex') === hash) {
                    if (data.status === USER_PENDING_EMAIL_STATUS) {
                        sendError(res, 401, PENDING_VERIFICATION_ERROR_MSG);
                    }
                    else {
                        sendToken(res, req.jwtLoginSecret, data);
                    }
                }
                else {
                    sendError(res, 401, INCORRECT_PASSWORD_ERROR_MSG); // can change error messages later
                }
            });
        }
    })
    .catch(err => {
        sendError(res, 500, SERVER_ERROR_MSG);
    });
 
})

module.exports = router;