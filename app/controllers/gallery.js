var path = require('path');
var fs = require('fs');
var glob = require('glob');
var async = require('async');

var photosAPIPath = '/api/gallery/photos/';

exports.middlewareFileUpload = function(req, res, next) {
    console.log('File uploaded');
    console.log(req.file);
    next(req, res);
};

exports.getPicture = function(req, res) {
  var id = req.params.id;
  var user = req.params.user;
  var uploadPath = __dirname + '/../uploads/' + user + '/';

  var flatFile = path.resolve(uploadPath + id);
  var pngFile = path.resolve(uploadPath + id + '.png');
  var jpgFile = path.resolve(uploadPath + id + '.jpg');
  var svgFile = path.resolve(uploadPath + id + '.svg');

  if(fs.existsSync(flatFile)) {
    res.sendFile(flatFile);
    console.log(flatFile);
  }
  else if(fs.existsSync(pngFile)) {
    res.sendFile(pngFile);
    console.log(pngFile);
  }
  else if (fs.existsSync(jpgFile)) {
    res.sendFile(jpgFile);
    console.log(jpgFile);
  }
  else if (fs.existsSync(svgFile)) {
    res.sendFile(svgFile);
    console.log(svgFile);
  }
  else {
    res.status(400).send('No image associated with submitted id.');
  }
};

exports.getPictures = function(req, res) {
  var id = req.params.id;
  var user = req.params.user;
  var uploadPath = __dirname + '/../uploads/' + user + '/';

  glob("?????????.*", {cwd: uploadPath}, function (er, files) {
    async.map(files, function(file, cb){
        var APILink = 'http://' + req.headers.host + photosAPIPath + user + '/';
        console.log(file);
        cb(null,{
            photo: APILink + file,
            thumbnail: APILink + 'thumbnail-'+file,
            converted: APILink + 'converted-'+file
        });
    }, function(err, results) {
        console.log(results);
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send(results);
    });
  });

};
