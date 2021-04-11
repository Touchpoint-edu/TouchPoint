var express = require('express');
var router = express.Router();
var mongo = require('../models/mongo');
var crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const verifyUser = require('./email_verification').verifyUser;

const { ACCOUNT_EXISTS_ERROR_MSG, SERVER_ERROR_MSG } = require('../constants/errors');
const { USER_PENDING_EMAIL_STATUS } = require('../constants/status');
const { GOOGLE_CLIENT_ID } = require('../constants/config');

const USER_COLLECTION_NAME = "users";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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
                    status: USER_PENDING_EMAIL_STATUS
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
                    status: USER_PENDING_EMAIL_STATUS
                }, "", function(err, data) {
                    if (err) sendError(res, 500, SERVER_ERROR_MSG);
                    else {
                        verifyUser(email);
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