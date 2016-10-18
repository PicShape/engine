var path = require('path');
var mime = require('mime');
var express = require('express');

var primitive = require('../utils/primitive-wrapper.js').primitive;
var photosPath = '/api/gallery/photos/';

exports.middlewareFileUpload = function(req, res, next) {
  next();
}

exports.convert = function(req, res){
  var uploadDir = __dirname + '/../uploads/';

  if(req.file == undefined) {
    res.status(400).send('You need to provide an input picture.');
    return;
  }

  var errors = req.validationErrors();
  if (errors) {
    res.status(400).send('There have been validation errors: ' + errors);
    return;
  }

  var id = Math.random().toString(36).substr(2, 9);
  console.log("Convert called.");
  var file = req.file;
  var inputPath = __dirname + '/../uploads/' + file.fieldname + '.' + mime.extension(file.mimetype);
  var outputPath = __dirname + '/../uploads/'+ id + '.' + mime.extension(file.mimetype);

  primitive(inputPath,
            outputPath,
            {
              iter: 50,
              mode: 0,
            },
            (out) => {
                res.json({ message: 'Conversion done successfully.', url: 'http://' + req.headers.host + photosPath + id});
            }
          );
};
