var path = require('path');
var mime = require('mime');

var primitive = require('../utils/primitive-wrapper.js').primitive;



exports.welcome = function(req, res) {
    res.json({ message: 'Welcome to PicShape API!' });
};


exports.convert = function(req, res){
  console.log("Convert called.");
  let file = req.file;
  let inputPath = __dirname + '/../uploads/' + file.fieldname + '.' + mime.extension(file.mimetype);
  let outputPath = __dirname + '/../uploads/converted-'+ file.fieldname + '.' + mime.extension(file.mimetype);

  primitive(inputPath,
            outputPath,
            {
              iter: 50,
              mode: 0,
            },
            (out) => {
                res.json({ message: 'Uploaded and converted ! ' + out});
            }
          );
};
