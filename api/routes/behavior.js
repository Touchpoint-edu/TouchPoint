const express = require("express")
const ObjectId = require('mongodb').ObjectID;

const mongo = require('../models/mongo');
const verify = require('../scripts/verify')
const error = require('../scripts/error')

const { SERVER_ERROR_MSG } = require('../constants/errors');
const router = express.Router();

/**
 * add a behavior given a student_id and behavior name
 */
router.post("/add", function (req, res) {
    try {
        verify.verify(req.cookies.c_user, req.jwtLoginSecret, res);

        const behavior = {
            name: req.body.behavior_name,
            time: Date.now() / 1000,
            email: req.body["email"] //terry was here
        }

        mongo.insertOne("behaviors", behavior)
            .then(data => {
                if (!data) {
                    error.sendError(res, 500, SERVER_ERROR_MSG);
                }
            });

        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        error.sendError(res, 500, SERVER_ERROR_MSG);
    }
});

module.exports = router;
