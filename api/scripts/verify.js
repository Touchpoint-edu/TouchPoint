var jwt = require('jsonwebtoken');

exports.verify = function(req, key){
  try{
    const decoded = jwt.verify(req, key);
  }
  catch(err){
    throw err;
  }
}
