
var createEntityDirectory = require("../core/utils").createEntityDirectory;
var createEntityFile = require("../core/utils").createEntityFile;

/**
 * Create a new entity using the data in the request body.
 * @param req Request.
 * @param res Response.
 */
exports.postEntity = function(req, res) {
    // Write a log line.
    console.log("POST " + req.url);
    // Create the entity directory if it doesn't exists.
    createEntityDirectory(req.params.entity, function(err) {
        // Create the entity file.
        createEntityFile(req.params.entity, req.body, function(err, entityData) {
            // Serves the stored entity.
            res.send(entityData);
        });
    });
};
