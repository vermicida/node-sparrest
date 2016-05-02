
// Requires.
var config = require("../core/config");
var formidable = require("formidable");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var randomstring = require("randomstring");
var sprintf = require("sprintf-js").sprintf;

/**
 * Generate the file path to the given static document.
 * @param document The static document name.
 */
function getStaticDocumentPath(document) {

    return document ? path.resolve(config.dirs.static, document) : path.resolve(config.dirs.static);
}

/**
 * Generate a random name for a static document.
 * @param extension The static document extension.
 */
function generateRandomStaticDocumentName(extension) {

    var name = randomstring.generate({
        length: 16,
        readable: true,
        capitalization: "lowercase"
    });

    return sprintf("%s%s", name, extension);
}

var StaticFile = {

    /**
     * Extract and store the document uploaded in the given request.
     * @param req Request.
     * @param cb The action callback.
     */
    upload: (req, cb) => {

        // Create an incoming form with the request.
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;

        // Handle the end of the form parsing to prepare the response.
        form.on("end", () => {

            // If any image was uploaded.
            if (form.openedFiles && form.openedFiles.length > 0) {

                // Get the uploaded image file path and extension.
                var sourceFilePath = form.openedFiles[0].path;
                var sourceFileExtension = path.extname(sourceFilePath);

                // Get the target path for the uploaded image file.
                var targetFileName = generateRandomStaticDocumentName(sourceFileExtension);
                var targetFilePath = getStaticDocumentPath(targetFileName);

                // Create the entity path if it doesn't exists.
                mkdirp(getStaticDocumentPath(), (err) => {

                    // In case of error.
                    if (err) { cb(err); }

                    // Otherwise.
                    else {

                        // Move the image file from the temp directory.
                        fs.rename(sourceFilePath, targetFilePath, (err) => {

                            // In case of error.
                            if (err) { cb(err); }

                            // Otherwise.
                            else {

                                // Mount a path for the uploaded document serving.
                                var servePath = path.join("upload", targetFileName);
                                cb(undefined, { path: servePath });
                            }
                        });
                    }
                });
            }

            // Otherwise.
            else {
                cb(new Error("No document found."));
            }
        });

        // Parse the form.
        form.parse(req);
    },

    /**
     * Get the serving path for the given static document name.
     * @param document The document name.
     * @param cb The action callback.
     */
    serve: (document, cb) => {

        // Get the static document path.
        var staticDocumentPath = getStaticDocumentPath(document);

        // Check if the static document exists.
        fs.stat(staticDocumentPath, (err) => {

            // In case of error.
            if (err) { cb(err); }

            // Otherwise.
            else {
                cb(undefined, { path: staticDocumentPath });
            }
        });
    }
};

module.exports = StaticFile;
