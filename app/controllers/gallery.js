var path = require('path');
var fs = require('fs');
var glob = require('glob');
var async = require('async');

var photosAPIPath = '/api/gallery/photos/';

/**
 * Utility function to check and returns file if it exists with given 'id'.
 * Use with function(err, result) where results is 'undefined' if 0 file found.
 * @param  {[type]}   id   id of the photo to be retrieved
 * @param  {[type]}   user  User owner of the photo
 * @param  {Function} cb   Callback to give the resulted path
 * @return {[type]}        [description]
 */
function getPictureById(id, user, cb) {
    var uploadPath = path.join(__dirname, '/../uploads/', user, '/');

    var stripedId = id.replace(/\.[a-z]*/g,""); //Strip extension if it exists
    var flatFile = path.resolve(uploadPath + stripedId);
    var pngFile = path.resolve(flatFile + '.png');
    var jpgFile = path.resolve(flatFile + '.jpg');
    var svgFile = path.resolve(flatFile + '.svg');



    async.detect([pngFile,jpgFile,svgFile], function(filePath, callback) {
        fs.access(filePath, function(err) {
            callback(null, !err);
        });
    }, cb);
}


/**
 * Controller retrieving a picture given an id and an user.
 */
exports.getPicture = function(req, res) {
    var id = req.params.id;
    var user = req.params.user;

    getPictureById(id, user, function(err, result) {
        if(result === undefined){
            return res.status(400).send({
                errorMessage: 'Image with id ' + id + ' not found.',
            });
        }
        res.sendFile(result);
    });
};

/**
 * Retrieve all pictures associed with an user. Returns an array of objects
 * containing the multiples files associated with an id.
 * @param  {[type]} req Request containing user
 * @return {[type]}     [description]
 */
exports.getPictures = function(req, res) {
    var id = req.params.id;
    var user = req.params.user;
    var uploadPath = path.join(__dirname, '/../uploads/', user, '/');

    glob("?????????.*", { //9 symbols ID
        cwd: uploadPath
    }, function(er, files) {
        async.map(files, function(file, cb) {
            var APILink = 'http://' + req.headers.host + photosAPIPath + user + '/';
            console.log(file);
            cb(null, {
                photo: APILink + file,
                thumbnail: APILink + 'thumbnail-' + file,
                converted: APILink + 'converted-' + file
            });
        }, function(err, results) {
            console.log(results);
            if (err) {
                res.status(400).send({
                    errorMessage: 'There have been errors.',
                    errors: err
                });
                return;
            }
            res.send(results);
        });
    });

};

/**
 * Delete picture and all associated ones with a given id.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.deletePicture = function(req, res) {
    var id = req.params.id;
    var user = req.params.user;

    // Security check
    if(req.user.name != req.params.user) {
        console.log("User checking failed " + req.user.name + " " + req.params.user);
        return res.status(401).send({ msg: 'Unauthorized' });
    }

    getPictureById(id, user, function(err, result) {
        if(result === undefined){
            return res.status(400).send({
                errorMessage: 'Image with id ' + id + ' not found.',
            });
        }
        var pathToUserBaseDirectory = path.join(__dirname, '/../uploads/', user, '/');
        var file = path.basename(result);

        // We strip converted or thumbnail to avoid errors
        file = file.replace(/(converted|thumbnail)./i,"");
        console.log("stripped file : " + file);

        var picturesToDelete = [
            path.join(pathToUserBaseDirectory, file),
            path.join(pathToUserBaseDirectory,'converted-' + file)
        ];

        console.log('Files to delete: ' + picturesToDelete);

        async.each(picturesToDelete, fs.unlink, (err) => {
            if(err) {
                return res.status(400).send({
                    errorMessage: 'There have been errors.',
                    errors: err
                });
            }
            res.send({msg: 'Picture successfully deleted !', files: picturesToDelete.map((pic) => {
                return path.basename(pic);
            })});
        });
    });
};
