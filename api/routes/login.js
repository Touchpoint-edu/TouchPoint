var express = require("express")
var router = express.Router();
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client("903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com")

router.post("/auth/google", async (req, res) => {
    const { token }  = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "903480499371-fqef1gdanvccql6q51hgffglp7i800le.apps.googleusercontent.com"
    });
    const { email } = ticket.getPayload();    
    res.status(201);
    res.json(email);
})

module.exports = router;