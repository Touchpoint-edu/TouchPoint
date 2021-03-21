
exports.sendError = function(res, status, message) {
    res.status(status);
    res.json({
        message: message
    });
}
