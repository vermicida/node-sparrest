
var commonEntity = require("../entities/common-entity");
var staticFile = require("../entities/static-file");

/**
 * Handler for the entities collection retrieving requests.
 * @param req Request.
 * @param res Response.
 */
module.exports.listCommonEntities = (req, res) => {

    // Parameters.
    var type = req.params.entity;

    // Get the entities.
    commonEntity.list(type, (data) => {

        // Serves the entities collection.
        res.set("Content-Type", "application/json");
        res.status(200).send(data);
    });
};

/**
 * Handler for the entity retrieving requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.getCommonEntity = (req, res, next) => {

    // Parameters.
    var id = req.params.id;
    var type = req.params.entity;

    // Get the entity path.
    commonEntity.get(type, id, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // Serves the entity file content.
        res.set("Content-Type", "application/json");
        res.status(200).send(data);
    });
};

/**
 * Handler for the entity creation requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.createCommonEntity = (req, res, next) => {

    // Parameters.
    var type = req.params.entity;
    var entity = req.body;

    // Create a new entity.
    commonEntity.create(type, entity, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // Serves the entity file content.
        res.set("Content-Type", "application/json");
        res.status(201).send(data);
    });
};

/**
 * Handler for the entity replacing requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.replaceCommonEntity = (req, res, next) => {

    // Parameters.
    var type = req.params.entity;
    var id = req.params.id;
    var entity = req.body;

    // Overwrite the entity.
    commonEntity.replace(type, id, entity, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // Serves the entity file content.
        res.set("Content-Type", "application/json");
        res.status(200).send(data);
    });
};

/**
 * Handler for the entity edition requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.updateCommonEntity = (req, res, next) => {

    // Parameters.
    var type = req.params.entity;
    var id = req.params.id;
    var entity = req.body;

    // Update the entity.
    commonEntity.update(type, id, entity, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // Serves the entity file content.
        res.set("Content-Type", "application/json");
        res.status(200).send(data);
    });
};

/**
 * Handler for the entity removing requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.deleteCommonEntity = (req, res, next) => {

    // Parameters.
    var type = req.params.entity;
    var id = req.params.id;

    // Remove the entity.
    commonEntity.delete(type, id, (err) => {

        // In case of error.
        if (err) { return next(err); }

        // Serves the entity file content.
        res.status(204).send();
    });
};

/**
 * Handler for the static file uploading requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.uploadStaticFile = (req, res, next) => {
    
    var stream;
    
    staticFile.upload(stream, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // TODO
    });
};

/**
 * Handler for the static file serving requests.
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
module.exports.serveStaticFile = (req, res, next) => {
    
    var id;
    
    staticFile.serve(id, (err, data) => {

        // In case of error.
        if (err) { return next(err); }

        // TODO
    });
};
