var jwt = require('jsonwebtoken');

exports.verify = function(req, key){
  try{
    let decoded = jwt.verify(req, key);
    return decoded;
  } catch(err){
    throw err;
  }
}
