
// Dependencies.
const _ = require("lodash");
const config = require("../core/config");
const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

/**
 * Generate the file path to the given entity type and identifier.
 * @param type The entity type.
 * @param id The entity identifier.
 */
function getEntityPath(type, id) {

    return id ? path.resolve(config.dirs.api, type, ("" + id)) : path.resolve(config.dirs.api, type);
}

/**
 * List the given directory files.
 * NOTE: In case of error, an empty array is returned.
 * @param dir The directory to read.
 * @param cb The action callback.
 */
function getDirectoryFiles(dir, cb) {

    fs.readdir(dir, (err, files) => { cb(err ? [] : files); });
}

/**
 * List the given directory files, sorted alphabetically ascending.
 * @param dir The directory to read.
 * @param cb The action callback.
 */
function getDirectoryFilesSortedAsc(dir, cb) {

    // Get the directory files.
    getDirectoryFiles(dir, (files) => {

        // Sort the files.
        var sorted = files.sort((a, b) => { return +a - +b; });

        // Execute the callback.
        cb(sorted);
    });
}

/**
 * List the given directory files, sorted alphabetically descending.
 * @param dir The directory to read.
 * @param cb The action callback.
 */
function getDirectoryFilesSortedDesc(dir, cb) {

    // Get the directory files.
    getDirectoryFiles(dir, (files) => {

        // Sort the files.
        var sorted = files.sort((a, b) => { return +b - +a; });

        // Execute the callback.
        cb(sorted);
    });
}

var CommonEntity = {

    /**
     * Get the entities corresponding the given type.
     * @param type The entity type.
     * @param filter A filter object to apply to the collection.
     * @param sort A sort condition to apply to the collection.
     * @param cb The action callback.
     */
    list: (type, filter, sort, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type);

        // Get the files in the directory path.
        getDirectoryFilesSortedAsc(entityPath, (files) => {

            // Create a list with the files content.
            var contents = files.map((file) => { return fs.readFileSync(getEntityPath(type, file)); });

            // Create the JSON object with the entities.
            var entities = JSON.parse("[" + contents.join(",") + "]");
            
            // Filter the entities collection.
            if (entities.length > 0 && _.isString(filter)) {

                try {

                    // Try to parse the given filter first.
                    filter = JSON.parse(filter);
                    entities = _.filter(entities, filter);
                }
                catch(err) {
                    /* Do nothing */
                }
            }

            // Sort the entities collection.
            if (entities.length > 0 && _.isString(sort)) {

                // Check the sort direction first.
                entities = sort.startsWith("-") ? _.orderBy(entities, sort.substring(1), "desc") : _.sortBy(entities, sort);
            }

            // Create and return the JSON object with the entities.
            cb(entities);
        });
    },

    /**
     * Get the entity corresponding the given type and identifier.
     * @param type The entity type.
     * @param id The entity identifier.
     * @param cb The action callback.
     */
    get: (type, id, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type, id);

        // Read the entity file.
        fs.readFile(entityPath, (err, data) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {

                // Parse the entity and execute the callback.
                cb(undefined, JSON.parse(data));
            }
        });
    },

    /**
     * Create a new entity file with the given data.
     * @param type The entity type.
     * @param data The entity data.
     * @param cb The action callback.
     */
    create: (type, data, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type);

        // Create the entity path if it doesn't exists.
        mkdirp(entityPath, (err) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {

                // Get the files in the directory path.
                getDirectoryFilesSortedDesc(entityPath, (files) => {

                    // Generate the next available entity identifier.
                    data.id = files.length === 0 ? 1 : (+files[0] + 1);

                    // Get the path for the new entity.
                    entityPath = getEntityPath(type, data.id);

                    // Write the entity data and return it.
                    fs.writeFile(entityPath, JSON.stringify(data), (err) => { cb(err, data); });
                });
            }
        });
    },

    /**
     * Overwrite a previously created entity file.
     * @param type The entity type.
     * @param id The entity identifier.
     * @param data The entity data.
     * @param cb The action callback.
     */
    replace: (type, id, data, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type, id);

        // Check if the entity file exists.
        fs.stat(entityPath, (err) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {

                // Overwrite the entity identifier.
                data.id = +id;

                // Overwrite the entity file.
                fs.writeFile(entityPath, JSON.stringify(data), (err) => {

                    // Execute the callback.
                    cb(err, data);
                });
            }
        });
    },

    /**
     * Update a previously created entity file.
     * @param type The entity type.
     * @param id The entity identifier.
     * @param data The entity data.
     * @param cb The action callback.
     */
    update: (type, id, data, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type, id);

        // Read the entity file.
        fs.readFile(entityPath, "utf8", (err, content) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {

                // Parse the entity file content.
                var current = JSON.parse(content);

                // Merge the current data with the new one.
                _.merge(current, data);

                // Overwrite the entity identifier.
                current.id = +id;

                // Write the new entity data to the file.
                fs.writeFile(entityPath, JSON.stringify(current), (err) => {

                    // Execute the callback.
                    cb(err, current);
                });
            }
        });
    },

    /**
     * Remove an existing entity file.
     * @param type The entity type.
     * @param id The entity identifier.
     * @param cb The action callback.
     */
    delete: (type, id, cb) => {

        // Get the entity path.
        var entityPath = getEntityPath(type, id);

        // Check if the entity file exists.
        fs.stat(entityPath, (err) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {

                // Remove the entity file.
                fs.unlink(entityPath, cb);
            }
        });
    }
};

module.exports = CommonEntity;
