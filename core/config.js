
/**
 * Module config loader based on John Papa's lite-server module.
 * https://www.npmjs.com/package/lite-server
 */

var _ = require("lodash");
var path = require("path");
var argv = require("minimist")(process.argv.slice(2));

// The module default config.
var defaultConfig = {
    "server": {
        "apiDir": "./api",
        "apiFileExtension": ".json",
        "host": "127.0.0.1",
        "port": 8000
    }
};

// The user default config.
var userConfig = {};

// Try to get the user config.
var nsConfigName = argv.c || argv.config || "ns-config";
var nsConfigPath = path.resolve(nsConfigName);

try {
    userConfig = require(nsConfigPath);
}
catch(err) {
    // If the config file was not found.
    if (err.code && err.code === "MODULE_NOT_FOUND") {
        console.info("No `ns-config.json` or `ns-config.js` file was not found. Using the node-sparrest defaults...");
    }
    // If another error was thrown.
    else {
        throw(err);
    }
}

// Overrides the module default config with the user's one.
_.merge(defaultConfig, userConfig);

exports.config = defaultConfig;
