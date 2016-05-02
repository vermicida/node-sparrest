
// Requires.
var express = require("express");
var bodyParser = require("body-parser");
var dateFormat = require("dateformat");
var sprintf = require("sprintf-js").sprintf;
var controllers = require("./controllers/controllers");
var config = require("./core/config");

// The Express application.
var app = express();
app.use(bodyParser.json());

// Set the middleware to log the incoming requests.
app.use(function(req, res, next) {
    var now = dateFormat(new Date(), "dd/mm/yyyy HH:MM:ss");
    console.log(sprintf(
        "%s %s %s %s",
        now,
        res.statusCode,
        req.method,
        req.url
    ));
    next();
});

// Set the application handlers.
app.get("/api/:entity", controllers.listCommonEntities);
app.get("/api/:entity/:id", controllers.getCommonEntity);
app.post("/api/:entity", controllers.createCommonEntity);
app.put("/api/:entity/:id", controllers.replaceCommonEntity);
app.patch("/api/:entity/:id", controllers.updateCommonEntity);
app.delete("/api/:entity/:id", controllers.deleteCommonEntity);
app.post("/upload", controllers.uploadStaticFile);
app.get("/upload/:document", controllers.serveStaticFile);

// Start the server.
app.listen(
    config.server.port,
    config.server.host,
    function() {
        // Show a log with the config.
        console.log("------------------------------------------");
        console.log(sprintf("          API dir: %s", config.dirs.api));
        console.log(sprintf(" Static files dir: %s", config.dirs.static));
        console.log(sprintf("           Server: http://%s:%s", config.server.host, config.server.port));
        console.log("------------------------------------------");
    }
);
