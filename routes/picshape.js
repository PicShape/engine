var express = require('express');

var picshapeController = require('../controllers/picshape');

// ROUTES FOR OUR API
// =============================================================================
var picshapeRouter = express.Router(); // get an instance of the express Router

// Middleware goes first
picshapeRouter.use(picshapeController.middlewareFileUpload);

picshapeRouter.get('/',(req,res)=>{res.json('yay')});
picshapeRouter.get('/convert',(req,res)=>{res.json('yo')});


module.exports = picshapeRouter;
