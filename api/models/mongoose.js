const mongoose = require('mongoose');

var state = {
  client: null,
  db: null
}

exports.connect = function(url, done) {
  if (state.db) return done()

  let mongoDB =  url;
  mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => done())
    .catch((err) => done(err));
}
