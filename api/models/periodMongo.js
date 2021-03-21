const MongoClient = require("mongodb").MongoClient
const mongo = require("mongo")

exports.updatePeriod = function(collection){
  mongo.db.collection(collection)
}
