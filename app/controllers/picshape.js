var path = require('path');
var mime = require('mime');
var express = require('express');

var primitive = require('../utils/primitive-wrapper.js').primitive;
var validationSchemas = require('./validationSchemas');

var photosPath = '/api/gallery/photos/';

/**
 * Middleware called when a request is submitted. Can be used for debugging.
 */
exports.middlewareFileUpload = function(req, res, next) {
    next();
};

/**
 * Controller receiving an image and starting conversion thanks to 'primitive-wrapper'
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.convert = function(req, res){
    console.log(req.user);
    var uploadDir = path.join(__dirname, '/../uploads/', req.user.name, '/');
    const DEFAULT_ITER_AMOUNT = 100;
    const DEFAULT_MODE = 0;
    const DEFAULT_FORMAT = 'png';



    req.check(validationSchemas.convertSchema);

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send( { errorMessage: 'There have been validation errors.', errors: errors });
        return;
    }

    // Fallback 'just in case'
    if(req.file === undefined) {
        res.status(400).send({ errorMessage : 'You need to provide an input picture.' });
        return;
    }

    var config = {
        iter: req.body.iter ? req.body.iter : DEFAULT_ITER_AMOUNT,
        mode: req.body.mode ? req.body.mode : DEFAULT_MODE,
        format: req.body.format ? req.body.format.toLowerCase() : DEFAULT_FORMAT
    };

    var file = req.file;
    var inputPath = uploadDir + file.filename;
    var outputPath = uploadDir + 'converted-' + file.filename;


    primitive(inputPath,
        outputPath,
        config,
        (out) => {
            res.json({ successMessage: 'Conversion done successfully.', url: 'http://' + req.headers.host + photosPath + req.user.name + '/converted-' + file.filename });
        }
    );
};
