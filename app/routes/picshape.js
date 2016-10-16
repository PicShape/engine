var express = require('express');
var multer  = require('multer')
var mime = require('mime');

var picshapeController = require('../controllers/picshape');



// Configure storage engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log();
    cb(null, __dirname + '/../uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.' + mime.extension(file.mimetype))
  }
})

var upload = multer({ storage: storage })



// ROUTES FOR /API/PICSHAPE/
// =============================================================================
var picshapeRouter = express.Router(); // get an instance of the express Router

// Middleware goes first
picshapeRouter.use(picshapeController.middlewareFileUpload);

picshapeRouter.get('/', (req, res) => { res.json('Welcome to PicShape sub-API !') });
picshapeRouter.post('/convert',upload.single('photo'),picshapeController.convert);


module.exports = picshapeRouter;