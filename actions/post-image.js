
var fs = require("fs");
var path = require("path");
var randomstring = require("randomstring");
var formidable = require("formidable");
var config = require("../core/config").config;
var utils = require("../core/utils");

/**
 *
 * @param req Request.
 * @param res Response.
 * @param next Next matching route.
 */
exports.postImage = function(req, res, next) {

    // Create an incoming form with the request.
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;

    // Handle the end of the form parsing to prepare the response.
    form.on("end", function() {

        // If any image was uploaded.
        if (this.openedFiles && this.openedFiles.length > 0) {

            //
            var uploadedFile = this.openedFiles[0];

            // Create the entity directory if it doesn't exists.
            utils.createEntityDirectory("upload", function(err) {

                // In case of error.
                if (err) { return next(error); }

                // Generate a random file name.
                var randomImageFileName = randomstring.generate({
                    length: 12,
                    readable: true,
                    capitalization: "lowercase"
                });

                // Set the destination path.
                var destination = path.resolve(
                    utils.getEntitiesPath("upload"),
                    randomImageFileName + path.extname(uploadedFile.path)
                );

                console.log("Uploaded path: " + uploadedFile.path);
                console.log("Destination path: " + destination);

                // Move the image file from the temp directory.
                fs.rename(uploadedFile.path, destination, function (err) {
                    // In case of error.
                    if (err) { return next(error); }
                    //
                    res.send({
                        url: destination
                    });
                });
            });
        }
        else {
            // TODO: Throw error.
        }
    });
    // Parse the form.
    form.parse(req);
};
