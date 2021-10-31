var express = require('express');
var router = express.Router();
var mongo = require('../../models/mongo');
var crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const verifyUser = require('./email_verification').verifyUser;
const SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly'];

const { ACCOUNT_EXISTS_ERROR_MSG, SERVER_ERROR_MSG } = require('../../constants/errors');
const { USER_PENDING_EMAIL_STATUS, USER_ACTIVE_STATUS } = require('../../constants/status');
const { GOOGLE_CLIENT_ID } = require('../../constants/config');

var readline = require('readline');
const fs = require('fs');
const {google} = require('googleapis');
const TOKEN_PATH = 'token.json';


const USER_COLLECTION_NAME = "users";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Load client secrets from a local file.
fs.readFile('/Users/Kaitlyn/Documents/College/4/cs401/TouchPoint/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Classroom API.
    authorize(JSON.parse(content), listCourses);
  });

  /**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }


  /**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }
  
  /**
   * Lists the first 10 courses the user has access to.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listCourses(auth) {
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

function sendError(res, status, message) {
    res.status(status);
    res.json({
        message: message
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
        const { sub, email, given_name, family_name } = ticket.getPayload();
        const options = {
            projection: {
                _id: 1,
                name: 1
            }
        }
        mongo.findUser({ email: email }, options)
        .then((data) => {
            if (data !== null) {
                sendError(res, 400, ACCOUNT_EXISTS_ERROR_MSG);
            }
            else {
                mongo.insertOne(USER_COLLECTION_NAME, {
                    google_id: sub,
                    fname: given_name,
                    lname: family_name,
                    email: email,
                    status: USER_ACTIVE_STATUS
                }, "", (err, data) => {
                    if (err) {
                        sendError(res, 500, SERVER_ERROR_MSG)
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
        });
    })
    .catch(error => {
        sendError(res, 500, SERVER_ERROR_MSG);
    });
});

router.post("/", async (req, res) => {
    const base64credentials = req.headers.authorization.split(' ')[1]
    const credentials = Buffer.from(base64credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const {fname, lname} = req.body;
    const options = {
        projection: {
            _id: 1,
            email: 1,
            hash: 1,
            fname: 1,
            lname: 1,
            google_id: 1
        }
    }

    // find email in database
    mongo.findUser({ email: email }, options)
    .then(data => {
        if (!!data) {
            sendError(res, 400, ACCOUNT_EXISTS_ERROR_MSG);
        }
        else {
            
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(password, salt, 10000, 16, 'sha512', (err, derivedKey) => {
                if (err) {
                    throw err;
                }
                const hash = derivedKey.toString('hex') + ":" + salt.toString('hex');
                mongo.insertOne(USER_COLLECTION_NAME, {
                    fname: fname,
                    lname: lname,
                    email: email,
                    hash: hash,
                    status: USER_ACTIVE_STATUS
                }, "", function(err, data) {
                    if (err) sendError(res, 500, SERVER_ERROR_MSG);
                    else {
                        verifyUser(email, req.emailCredentials, req.jwtVerifySecret);
                        res.sendStatus(201);
                    }
                });
            });
        }
    })
    .catch(err => {
        sendError(res, 500, SERVER_ERROR_MSG);
    });
 
})

module.exports = router;