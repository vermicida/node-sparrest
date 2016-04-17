
var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var config = require("../core/config").config;

/**
 * Extend the Array prototype.
 * Push the given item and return the array itself.
 */
if (!Array.prototype.pushRetrieve) {
    Array.prototype.pushRetrieve = function (item) {
        this.push(item);
        return this;
    };
}

/**
 * Generate the directory path to the given entity type.
 * @param entityType Entity type (the directory name).
 */
function getEntitiesPath(entityType) {
    return path.resolve(config.server.apiDir, entityType);
}

/**
 * Generates the file path to the given entity type and identifier.
 * @param entityType Entity type (the directory name).
 * @param entityId Entity identifier.
 */
function getEntityPath(entityType, entityId) {
    return entityType === "upload"
        ? path.resolve(config.server.apiDir, entityType, entityId)
        : path.resolve(config.server.apiDir, entityType, entityId + config.server.apiFileExtension);
}

/**
 * List the given directory files, sorted alphabetically ascending.
 * @param dir Directory to read.
 * @param cb Action callback.
 */
function getDirectoryFilesSortedAsc(dir, cb) {
    // Get the given directory files.
    fs.readdir(dir, function(err, files) {
        // If the directory doesn't exists.
        if (err && err.code === "ENOENT") {
            files = [];
        }
        // Sort them.
        var sorted = files.sort(function(a, b) {
            return +a.replace(config.server.apiFileExtension, "") - +b.replace(config.server.apiFileExtension, "");
        });
        // Return them.
        cb(undefined, sorted);
    });
}

/**
 * List the given directory files, sorted alphabetically descending.
 * @param dir Directory to read.
 * @param cb Action callback.
 */
function getDirectoryFilesSortedDesc(dir, cb) {
    // Get the given directory files.
    fs.readdir(dir, function(err, files) {
        // If the directory doesn't exists.
        if (err && err.code === "ENOENT") {
            files = [];
        }
        // Sort them.
        var sorted = files.sort(function(a, b) {
            return +b.replace(config.server.apiFileExtension, "") - +a.replace(config.server.apiFileExtension, "");
        });
        // Return them.
        cb(undefined, sorted);
    });
}

/**
 * Create an entity directory if it doesn't exists.
 * @param entityType Entity type (the directory name).
 * @param cb Action callback.
 */
function createEntityDirectory(entityType, cb) {
    // Generate the API directory path.
    var apiPath = path.resolve(config.server.apiDir);
    // Get the directory stats.
    fs.stat(apiPath, function(err) {
        // If the directory doesn't exists.
        if (err && err.code === "ENOENT") {
            // Create the directory.
            fs.mkdirSync(apiPath);
        }
        // Generate the entity directory path.
        var dirPath = getEntitiesPath(entityType);
        // Get the directory stats.
        fs.stat(dirPath, function(err) {
            // If the directory doesn't exists.
            if (err && err.code === "ENOENT") {
                // Create the directory.
                fs.mkdirSync(dirPath);
            }
            // Execute the callback.
            cb(undefined);
        });
    });
}

/**
 * Create a new entity file.
 * @param entityType Entity type.
 * @param entityData Entity data.
 * @param cb Action callback.
 */
function createEntityFile(entityType, entityData, cb) {
    // Generate the directory path.
    var dirPath = getEntitiesPath(entityType);
    // Get the directory files, sorted descending.
    getDirectoryFilesSortedDesc(dirPath, function(err, files) {
        // Generate the next available entity identifier.
        var entityId = files.length === 0 ? 1 : (+files[0].replace(config.server.apiFileExtension, "") + 1);
        // Set the identifier to the entity.
        entityData.id = entityId;
        // Generate the entity file path.
        var filePath = getEntityPath(entityType, entityId);
        // Write the entity data to the its file path.
        fs.writeFile(filePath, JSON.stringify(entityData), function(err) {
            // Execute the callback.
            cb(err, entityData);
        });
    });
}

/**
 * Overwrite a previously created entity file.
 * @param entityType Entity type (the directory name).
 * @param entityId Entity identifier.
 * @param entityData Entity data.
 * @param cb Action callback.
 */
function overwriteEntityFile(entityType, entityId, entityData, cb) {
    // Generate the entity file path.
    var filePath = getEntityPath(entityType, entityId);
    // Get the file stats.
    fs.stat(filePath, function(err) {
        // If the file does not exists.
        if (err) {
            // Execute the callback.
            cb(err);
        }
        // Otherwise.
        else {
            // Set the identifier to the entity.
            entityData.id = entityId;
            // Overwrite the entity data.
            fs.writeFile(filePath, JSON.stringify(entityData), function (err) {
                // Execute the callback.
                cb(err, entityData);
            });
        }
    });
}

/**
 * Remove an existing entity file.
 * @param entityType Entity type (the directory name).
 * @param entityId Entity identifier.
 * @param cb Action callback.
 */
function deleteEntityFile(entityType, entityId, cb) {
    // Generate the entity file path.
    var filePath = getEntityPath(entityType, entityId);
    // Get the file stats.
    fs.stat(filePath, function(err) {
        // If the file does not exists.
        if (err) {
            // Execute the callback.
            cb(err);
        }
        // Otherwise.
        else {
            // Remove the entity file.
            fs.unlink(filePath, cb);
        }
    });
}

/**
 * Update a previously created entity file.
 * @param entityType Entity type (the directory name).
 * @param entityId Entity identifier.
 * @param entityData Entity data.
 * @param cb Action callback.
 */
function updateEntityFile(entityType, entityId, entityData, cb) {
    // Generate the entity file path.
    var filePath = getEntityPath(entityType, entityId);
    // Read the entity file.
    fs.readFile(filePath, "utf8", function(err, data) {
        // If the file does not exists.
        if (err) {
            // Execute the callback.
            cb(err);
        }
        // Otherwise.
        else {
            // Parse the entity file content.
            var currentData = JSON.parse(data);
            // Merge the current data with the new one.
            _.merge(currentData, entityData);
            // Write the new entity data to the its file path.
            fs.writeFile(filePath, JSON.stringify(currentData), function(err) {
                // Execute the callback.
                cb(err, currentData);
            });
        }
    });
}

exports.getEntitiesPath = getEntitiesPath;
exports.getEntityPath = getEntityPath;
exports.getDirectoryFilesSortedAsc = getDirectoryFilesSortedAsc;
exports.getDirectoryFilesSortedDesc = getDirectoryFilesSortedDesc;
exports.createEntityDirectory = createEntityDirectory;
exports.createEntityFile = createEntityFile;
exports.overwriteEntityFile = overwriteEntityFile;
exports.deleteEntityFile = deleteEntityFile;
exports.updateEntityFile = updateEntityFile;
