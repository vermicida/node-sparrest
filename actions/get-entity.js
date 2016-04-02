
var getEntityPath = require("../core/utils").getEntityPath;

/**
 * Get the entity corresponding the given type and identifier.
 * @param req Request.
 * @param res Response.
 */
exports.getEntity = function(req, res) {
    // Write a log line.
    console.log("GET " + req.url);
    // Gets the entity file path.
    var path = getEntityPath(req.params.entity, req.params.id);
    // Serves the entity file content.
    res.sendFile(path);
};
