
var express = require("express");
var bodyParser = require("body-parser");
var config = require("./core/config").config;
var getEntities = require("./actions/get-entities").getEntities;
var getEntity = require("./actions/get-entity").getEntity;
var postEntity = require("./actions/post-entity").postEntity;

// Create the express application.
var app = express();

// Set the middleware to parse the JSON request body properly.
app.use(bodyParser.json());

// Set the application handlers.
app.get("/api/:entity", getEntities);
app.get("/api/:entity/:id", getEntity);
app.post("/api/:entity", postEntity);

// Start the server.
app.listen(
    config.server.port,
    config.server.host,
    function() {
        console.log("node-sparrest is running at http://" + config.server.host + ":" + config.server.port);
    }
);
