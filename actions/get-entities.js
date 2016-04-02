
var fs = require("fs");
var getDirectoryFilesSortedAsc = require("../core/utils").getDirectoryFilesSortedAsc;
var getEntitiesPath = require("../core/utils").getEntitiesPath;

/**
 * Creates a JSON object with the entities stored in the given folder.
 * @param dir Directory to read.
 * @param cb Action callback.
 */
function createJsonWithFilesInDirectory(dir, cb) {
    // List the given directory files.
    getDirectoryFilesSortedAsc(dir, function(err, files) {
        // Create a list with the files content.
        var contents = files.reduce(function(previous, current) { return previous.pushRetrieve(fs.readFileSync(dir + "/" + current)); }, []);
        // Create and return the JSON object with the entities.
        cb(undefined, JSON.parse("[" + contents.join(",") + "]"));
    });
}

/**
 * Get the entities corresponding the given type.
 * @param req Request.
 * @param res Response.
 */
exports.getEntities = function(req, res) {
    // Write a log line.
    console.log("GET " + req.url);
    // Gets the entities directory path.
    var path = getEntitiesPath(req.params.entity);
    // Creates a JSON with the entities stored in the given folder (the entity type in path).
    createJsonWithFilesInDirectory(path, function(err, json) {
        // Serves the entities collection.
        res.send(json);
    });
};
