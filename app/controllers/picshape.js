var path = require('path');
var mime = require('mime');
var express = require('express');
var fs = require('fs');

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

    var photosAPIPath = '/api/gallery/photos/';
    var APILink = 'http://' + req.headers.host + photosAPIPath + req.user.name + '/';

    primitive(inputPath,
        outputPath,
        config,
        (out) => {
            fs.stat(uploadDir + file.filename, (err, stats) => {
                if(err) {
                    return res.status(400).send({ errorMessage : 'Error retrieving information on uploaded file.', err: err });
                }
                res.json({
                    successMessage: 'Conversion done successfully.',
                    photo: APILink + file.filename,
                    //thumbnail: APILink + 'thumbnail-' + file,
                    thumbnail: APILink + file.filename,
                    converted: APILink + 'converted-' + file.filename,
                    timestamp: stats.birthtime.getTime(),
                    user: req.user.name,
                });
            });
        });
};
