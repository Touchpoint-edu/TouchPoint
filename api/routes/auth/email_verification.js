var express = require("express")
var nodemailer = require('nodemailer');
var handlebars = require('handlebars');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongo = require('../../models/mongo');

const mailjet = require ('node-mailjet')
.connect('c5b89163137fac91509e7fb9b158ae39', 'b12f7563a032f1f299d18056d6df5d0a')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "touchpoint.devteam@gmail.com",
        "Name": "Elaine"
      },
      "To": [
        {
          "Email": "touchpoint.devteam@gmail.com",
          "Name": "Elaine"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })

module.exports = {
    router: router,
    //verifyUser: verifyUser
};