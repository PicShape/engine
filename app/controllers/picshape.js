var path = require('path');
var mime = require('mime');
var express = require('express');

var primitive = require('../utils/primitive-wrapper.js').primitive;
var validationSchemas = require('./validationSchemas');

var photosPath = '/api/gallery/photos/';


exports.middlewareFileUpload = function(req, res, next) {
    next();
}

exports.convert = function(req, res){

    var uploadDir = __dirname + '/../uploads/';
    const DEFAULT_ITER_AMOUNT = 100;
    const DEFAULT_MODE = 0;
    const DEFAULT_FORMAT = 'png';

    if(req.file == undefined) {
        res.status(400).send({ errorMessage : 'You need to provide an input picture.' });
        return;
    }

    req.check(validationSchemas.convertSchema);

    var errors = req.validationErrors(true);
    if (errors) {
        res.status(400).send( { errorMessage: 'There have been validation errors.', errors: errors });
        return;
    }

    var iter = req.body.iter ? req.body.iter : DEFAULT_ITER_AMOUNT;
    var mode = req.body.mode ? req.body.mode : DEFAULT_MODE;
    var format = req.body.format ? req.body.format.toLowerCase() : DEFAULT_FORMAT;

    var id = Math.random().toString(36).substr(2, 9);
    var file = req.file;
    var inputPath = uploadDir + file.fieldname + '.' + mime.extension(file.mimetype);
    var outputPath = uploadDir + id + '.' + format;


    primitive(inputPath,
        outputPath,
        {
            iter: iter,
            mode: mode,
            format: format,
        },
        (out) => {
            res.json({ successMessage: 'Conversion done successfully.', url: 'http://' + req.headers.host + photosPath + id});
        }
    );
};
