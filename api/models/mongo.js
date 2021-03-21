var MongoClient = require('mongodb').MongoClient

var state = {
  client: null,
  db: null
}

exports.connect = function(url, done) {
  if (state.db) return done()

  MongoClient.connect(url, function(err, client) {
    if (err) return done(err);
    state.client = client;
    state.db = client.db();
    done()
  })
}

exports.db = function(name) {
  if (name) {
    return state.client.db(name);
  }
  return state.db;
}

exports.insertOne = function(collection, toInsert, databaseName) {
  if (databaseName) {
    return client.db(databaseName).collection(collection).insertOne(toInsert);
  }
  else {
    return state.db.collection(collection).insertOne(toInsert);
  }
}

exports.insertMany = function(collection, toInsert, databaseName) {
  if (databaseName) {
    client.db(databaseName).collection(collection).insertMany(toInsert);
  }
  else {
    state.db.collection(collection).insertMany(toInsert);
  }
}

exports.findUser = function(query, options, databaseName) {
  if (databaseName) {
    return client.db(databaseName).collection("users").findOne(query, options);
  }
  else {
    return state.db.collection("users").findOne(query, options);
  }
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}