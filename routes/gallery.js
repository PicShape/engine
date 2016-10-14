var express = require('express');

var galleryController = require('../controllers/gallery');

// ROUTES FOR OUR API
// =============================================================================
var galleryRouter = express.Router(); // get an instance of the express Router

galleryRouter.get('/',(req,res)=>{res.json('yay')});
galleryRouter.get('/:id',(req,res)=>{res.json('yay')});

module.exports = galleryRouter;
