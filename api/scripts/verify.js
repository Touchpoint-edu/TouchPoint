var jwt = require('jsonwebtoken');

exports.verify = function(req, key){
  try{
    let decoded = jwt.verify(req, key);
    return decoded;
  } catch(err){
    throw err;
  }
}

exports.verify = function(req, key, res){
  try{
    let decoded = jwt.verify(req, key);
    return decoded;
  } catch(err){
    res.status(401)
    res.json("Sign in noob")
    throw err;
  }
}
