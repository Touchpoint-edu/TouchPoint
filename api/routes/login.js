var express = require("express")
var mongo = require('../models/mongo');
var router = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var fs = require('fs');
const { OAuth2Client } = require('google-auth-library');

const SECRET_KEY = "ae280b2d0d3e3ca11caa15e3ba7ea172"; // move to environment variable when we transfer to server

const client = new OAuth2Client("903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com")

function sendToken(res, data) {
    const token = jwt.sign({
        sub: data._id,
        name: data.name
    }, SECRET_KEY, {expiresIn: '1h'}); // change expiry time
    res.cookie('c_user', token, { 
        expires: new Date(Date.now() + 900000), // change expiry time
        httpOnly: true
    });
    res.sendStatus(200);
}

router.post("/auth/google", async (req, res) => {
    const { token }  = req.body;
    console.log(req.body);
    // Verify Google Token
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com"
    })
    .then(ticket => {
        // Find google id in database
        const { sub } = ticket.getPayload();
        const options = {
            projection: {
                _id: 1,
                name: 1
            }
        }
        mongo.findUser({ google_id: sub}, options)
        .then((data) => {
            if (data == null) {
                res.status(401);
                res.json({
                    message: "No account found. Please create an account."
                });
            }
            else {
                // successfully verified google token and found in db
                sendToken(res, data);
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(401);
        res.json({
            message: "Login with Google failed."
        });
    });
})

router.post("/auth", async (req, res) => {
    const base64credentials = req.headers.authorization.split(' ')[1]
    console.log(base64credentials);
    const credentials = Buffer.from(base64credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');
    const options = {
        projection: {
            _id: 1,
            email: 1,
            hash: 1,
            name: 1
        }
    }

    // find email in database
    mongo.findUser({ email: email }, options)
    .then(data => {
        if (!data) {
            res.status(401);
            res.json({
                message: "No account found. Please create an account."
            });
        }
        else {
            // hash provided password and check against hash stored in database
            const [hash, salt] = data.hash.split(':');
            crypto.pbkdf2(password, Buffer.from(salt, 'hex'), 10000, 16, 'sha512', (err, derivedKey) => {
                if (err) {
                    throw err;
                }
                console.log("got derived key: ", derivedKey.toString('hex'));
                console.log("hash: ", hash);
                console.log("salt: ", salt);
                if (derivedKey.toString('hex') === hash) {
                    sendToken(res, data);
                }
                else {
                    res.status(401);
                    res.json({
                        message: "Incorrect password." // can change error messages later
                    });
                }
            });
        }
    })
    .catch(err => {
        res.status(401);
        res.json({
            message: "Login failed."
        });
    });
 
})

module.exports = router;