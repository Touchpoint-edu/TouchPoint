var express = require("express")
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var router = express.Router();

//Getting fancy and trying to read html file 
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

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

     
    var email = req.query.user;
    console.log(email);

    //READS IN EMAIL TEMPLATE 
    //USES HANDLEBARS TO REPLACE {{emailID}} field with emailID 
    const filePath = "routes/email_template.html"; 
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    //REPLACE MESSAGE WITH USERS UNIQUE ID 
    const replacements = {
        emailID: "PLEASETELLMETHISWORKED"
    };
    const htmlToSend = template(replacements);
    //emailGood set to false for debugging purposes 
    var emailGood = true;
    if(emailGood){
        var mailOptions = {
        from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Validate TouchPoint Email',
            //Ideally, email is a link where if a userclicks on it, we know they are verified 
            html: htmlToSend 
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log('no');
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }else{
        console.log("not sending an email")
    }
    res.sendStatus(200);
})

router.get("/auth/email/validate/:emailID", async (req, res) => {
    var emailID = req.params.emailID; 
    console.log(emailID); 
    res.sendStatus(200); 
})
module.exports = router;