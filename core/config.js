
// Dependencies.
const _ = require("lodash");
const path = require("path");

// The module default config.
var defaultConfig = {
    "dirs": {
        "api": "./api",
        "static": "./static"
    },
    "server": {
        "host": "127.0.0.1",
        "port": 8000
    }
};

// The user default config.
var userConfig;

// Try to load a custom config file.
try {

    userConfig = require(path.resolve("ns-config"));
    console.log("------------------------------------------");
    console.log("A custom user config was found; using it.");
}
// In case of error.
catch(err) {

    // If the error is not related with the custom config file.
    if (!err.code || err.code !== "MODULE_NOT_FOUND") {
        process.exit(1);
    }

    // Otherwise.
    userConfig = {};
}

// Overrides the module default config with the user's one.
_.merge(defaultConfig, userConfig);

module.exports = defaultConfig;
