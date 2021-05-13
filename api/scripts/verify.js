var jwt = require('jsonwebtoken');
const { sendError } = require('./error');
const { JWT_EXPIRATION_ERROR_MSG } = require('../constants/errors');

exports.verify = function (req, key) {
  try {
    let decoded = jwt.verify(req, key);
    return decoded;
  } catch (err) {
    throw err;
  }
}

exports.verify = function (req, key, res) {
  try {
    let decoded = jwt.verify(req, key);
    return decoded;
  } catch (err) {
    sendError(res, 401, JWT_EXPIRATION_ERROR_MSG)
    throw err;
  }
}
