var express = require("express")
var router = express.Router();
var mongo = require('../models/mongo');
var crypto = require('crypto');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client("903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com")

function sendError(res, status, message) {
    res.status(status);
    res.json({
        message: message
    });
}

router.post("/google", async (req, res) => {
    const { token }  = req.body;
    console.log(req.body);
    // Verify Google Token
    client.verifyIdToken({
        idToken: token,
        audience: "903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com"
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
                sendError(res, 400, "Account already exists with this email. Please log in.");
            }
            else {
                mongo.insertOne("users", {
                    google_id: sub,
                    fname: given_name,
                    lname: family_name,
                    email: email,
                    status: "pending"
                });
            }
        });
    })
    .catch(error => {
        sendError(res, 500, "Signup with Google failed.");
    });
});

router.post("/", async (req, res) => {
    const base64credentials = req.headers.authorization.split(' ')[1]
    console.log(base64credentials);
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
            sendError(res, 400, "Account already exists with this email. Please log in.");
        }
        else {
            
            const salt = crypto.randomBytes(16);
            crypto.pbkdf2(password, salt, 10000, 16, 'sha512', (err, derivedKey) => {
                if (err) {
                    throw err;
                }
                const hash = derivedKey.toString('hex') + ":" + salt.toString('hex');
                mongo.insertOne("users", {
                    fname: fname,
                    lname: lname,
                    email: email,
                    hash: hash,
                    status: "pending"
                });

                // ADD EMAIL VERIFICATION HERE (suggested to create a email verification function)
                res.sendStatus(201);
            });
        }
    })
    .catch(err => {
        sendError(res, 500, "Signup failed.");
    });
 
})

module.exports = router;