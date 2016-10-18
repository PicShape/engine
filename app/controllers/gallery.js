var path = require('path');
var fs = require('fs');

exports.middlewareFileUpload = function(req, res, next) {
    console.log('File uploaded');
    console.log(req.file);
    next(req, res);
}

exports.getPicture = function(req, res) {
  var id = req.params.id;
  var uploadPath = __dirname + '/../uploads/';

  var pngFile = path.resolve(uploadPath + '/' + id + '.png');
  var jpgFile = path.resolve(uploadPath + '/' + id + '.jpg');
  var svgFile = path.resolve(uploadPath + '/' + id + '.svg');

  if(fs.existsSync(pngFile)) {
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
}
