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
router.post("/add/:student_id", function (req, res) {
    try {
        verify.verify(req.cookies.c_user, req.jwtLoginSecret);

        const behavior = {
            name: req.body.behavior_name,
            time: Date.now() / 1000,
            student_id: ObjectId(req.params['student_id']),
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
        error.sendError(res, "404", "huh");
    }
});

/**
 * retrieve a list of all behaviors associated with the given student
 */
router.get("/count-list/:student_id", function (req, res) {
    try {
        verify.verify(req.cookies.c_user, process.env.JWT_SECRET_KEY);

        // make mongo parameters
        const query = {
            student_id: new ObjectId(req.params['student_id'])
        }
        const options = {
            projection: {
                _id: 0,
                time: 0,
                student_id: 0
            }
        }

        // get all behavior documents of a student
        mongo.findMany("behaviors", query, options)
            .toArray((err, result) => {
                if (err) {
                    error.sendError(res, 500, SERVER_ERROR_MSG)
                }

                // use a map to count each behavior name
                let myMap = new Map();
                result.forEach((item) => {
                    if (myMap.has(item.name)) {
                        myMap.set(item.name, myMap.get(item.name) + 1)
                    } else {
                        myMap.set(item.name, 1);
                    }
                    
                })

                // create behaviors array to return
                let behaviors = [];
                for (let [key, value] of myMap) {
                    console.log(key)
                    console.log(value)
                    behaviors.push({
                        name: key,
                        count: value
                    })
                }

                res.status(200);
                res.json({
                    behaviors: behaviors
                })
            })   
    } catch (err) {
        console.log(err);
        error.sendError(res, "404", "huh");
    }
});

module.exports = router;
