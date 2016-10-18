var path = require('path');
var mime = require('mime');

var primitive = require('../utils/primitive-wrapper.js').primitive;


exports.middlewareFileUpload = function(req, res, next) {
    next();
}



exports.convert = function(req, res){
    var uploadDir = __dirname + '/../uploads/';
    const DEFAULT_ITER_AMOUNT = 100;
    const DEFAULT_MODE = 0;
    const DEFAULT_FORMAT = 'png';

    if(req.file == undefined) {
        res.status(400).send('You need to provide an input picture.');
        return;
    }


    // Validation Scheme for /convert
    var schema = {
     'iter': {
        optional: true,

        in: 'body',
        notEmpty: true,
        isInt: {
          options: [{ min: 1, max: 500 }],
          errorMessage: 'Invalid iteration amount [1 ; 500]'
        }
      },
      'mode': {
          optional: true,

          in: 'body',
          notEmpty: true,
          isInt: {
            options: [{ min: 0, max: 8 }],
            errorMessage: 'Invalid mode number'
          }
      },
     'format': {
         optional: true,

         in: 'body',
         notEmpty: true,
     }

    };

    req.check(schema);

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send( {message: 'There have been validation errors.', errors: errors });
        return;
    }

    var iter = req.body.iter ? req.body.iter : DEFAULT_ITER_AMOUNT;
    var mode = req.body.mode ? req.body.mode : DEFAULT_MODE;
    var format = req.body.format ? req.body.format : DEFAULT_FORMAT;

    var file = req.file;
    var inputPath = uploadDir + file.fieldname + '.' + mime.extension(file.mimetype);
    var outputPath = uploadDir + 'converted-'+ file.fieldname + '.' + format;



    primitive(inputPath,
        outputPath,
        {
            iter: iter,
            mode: mode,
            format: format,
        },
        (out) => {
            res.json({ message: 'Conversion done successfully.', url: outputPath});
        }
    );
};
