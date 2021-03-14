var express = require("express")
var nodemailer = require('nodemailer');
var router = express.Router();

router.post("/auth/email", async (req, res) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    console.log(process.env.EMAIL_USERNAME); 
    console.log(process.env.EMAIL_PASSWORD); 

    var mailOptions = {
    from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: 'Validate TouchPoint Email',
        //Ideally, email is a link where if a userclicks on it, we know they are verified 
        text: 'That was easy!'
    };
  
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.sendStatus(200);
})
module.exports = router;