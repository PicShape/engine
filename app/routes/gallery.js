var express = require('express');

var galleryController = require('../controllers/gallery');

// ROUTES FOR OUR API
// =============================================================================
var galleryRouter = express.Router(); // get an instance of the express Router

galleryRouter.get('/',(req,res)=>{res.json('yay');});
galleryRouter.get('/photos/:user/:id', galleryController.getPicture);
galleryRouter.get('/photos/:user', galleryController.getPictures);

module.exports = galleryRouter;
