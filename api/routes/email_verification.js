var express = require("express")
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongo = require('../models/mongo');

//Getting fancy and trying to read html file 
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

const JWT_EXPIRY_TIME = '1h'; // change expiry time

const verifyUser = function(email) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    });
    console.log(process.env.EMAIL_USERNAME); 
    console.log(process.env.EMAIL_PASSWORD); 
    
    //READS IN EMAIL TEMPLATE 
    //USES HANDLEBARS TO REPLACE {{emailID}} field with emailID 
    const filePath = "views/email_template.html"; 
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const template = handlebars.compile(source);
    //REPLACE MESSAGE WITH USERS UNIQUE ID
    const token = jwt.sign({
        sub: email,
    }, process.env.JWT_VERIFY_KEY, {expiresIn: JWT_EXPIRY_TIME});

    const replacements = {
        emailID: token
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
                console.log(error);
                console.log('no');
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }else{
        console.log("not sending an email")
    }
}

router.post("/auth/email", async (req, res) => {
    const email = req.body.email;
    console.log("email: ", email);
    verifyUser(email);
    res.sendStatus(200);
})

router.get("/auth/email/validate/:emailID", async (req, res) => {
    var token = req.params.emailID; 
    console.log(token);
    jwt.verify(token, process.env.JWT_VERIFY_KEY, function(err, data) {
        if (err) {
            res.sendStatus(404);
        }
        else {
            const email = data.sub;
            mongo.update("users", {email: email}, {
                $set: {
                    status: "active"
                }
            }, {}, function(error, result) {
                if (error) {
                    console.log(error);
                    res.sendStatus(404);
                }
                else {
                    console.log("success!");
                    if(JSON.parse(result).nModified === 1) {
                        res.status(200).send("Your email has been verified! <a href=\"http://localhost:3000\">Click here to login.</a>");
                    }
                    else {
                        res.sendStatus(404);
                    }
                }
            });
        }
    })
})
module.exports = {
    router: router,
    verifyUser: verifyUser
};