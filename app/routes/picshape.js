var express = require('express');
var multer  = require('multer');
var mime = require('mime');
var fs = require('fs');

var accountController = require('../controllers/account');
var picshapeController = require('../controllers/picshape');


// Configure storage engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadDir = __dirname + '/../uploads/';
    var userUploadDir = uploadDir +  req.user.name;


    if (!fs.existsSync(uploadDir)){
        console.log('Creating',uploadDir);
        fs.mkdirSync(uploadDir);
    }
    if (!fs.existsSync(userUploadDir)){
        console.log('Creating',userUploadDir);
        fs.mkdirSync(userUploadDir);
    }

    cb(null, userUploadDir);
  },
  filename: function (req, file, cb) {
    var id = Math.random().toString(36).substr(2, 9);
    cb(null, id + '.' + mime.extension(file.mimetype));
  }
});

var upload = multer({ storage: storage });



// ROUTES FOR /API/PICSHAPE/
// =============================================================================
var picshapeRouter = express.Router(); // get an instance of the express Router

// Middleware goes first
picshapeRouter.use(picshapeController.middlewareFileUpload);

picshapeRouter.get('/', (req, res) => { res.json('Welcome to PicShape sub-API !'); });
picshapeRouter.post('/convert', accountController.ensureAuthenticated, upload.single('photo'), picshapeController.convert);


module.exports = picshapeRouter;
