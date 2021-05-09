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
    res.json("Sign in noob")
    res.sendStatus(401)
    throw err;
  }
}
