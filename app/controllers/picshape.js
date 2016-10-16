var path = require('path');
var mime = require('mime');

var primitive = require('../utils/primitive-wrapper.js').primitive;


exports.middlewareFileUpload = function(req, res, next) {
  if(req.file) {
    console.log('File uploaded');
    console.log(req.file);
  } else {
    console.log('No file.');
  }
  next();
}



exports.convert = function(req, res){
  if(req.file == undefined) {
    res.status(400).send('You need to provide an input picture.');
    return;
  }

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).send('There have been validation errors: ' + errors);
    return;
  }

  console.log("Convert called.");
  var file = req.file;
  var inputPath = __dirname + '/../uploads/' + file.fieldname + '.' + mime.extension(file.mimetype);
  var outputPath = __dirname + '/../uploads/converted-'+ file.fieldname + '.' + mime.extension(file.mimetype);

  primitive(inputPath,
            outputPath,
            {
              iter: 50,
              mode: 0,
            },
            (out) => {
                res.json({ message: 'Conversion done successfully.', url: outputPath});
            }
          );
};
