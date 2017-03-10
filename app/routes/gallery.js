var express = require('express');
var accountController = require('../controllers/account');

var galleryController = require('../controllers/gallery');

// ROUTES FOR OUR API
// =============================================================================
var galleryRouter = express.Router(); // get an instance of the express Router

galleryRouter.get('/photos/:user/:id', galleryController.getPicture);
galleryRouter.get('/photos/:user', galleryController.getPictures);
galleryRouter.delete('/photos/:user/:id', accountController.ensureAuthenticated, galleryController.deletePicture);


module.exports = galleryRouter;
