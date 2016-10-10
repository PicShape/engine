// server.js

var express = require('express');
var expressValidator = require('express-validator');

var app = express();

var bodyParser = require('body-parser');
var multer  = require('multer')

// Controllers for routing
var picshapeController = require('./controllers/picshape');
var galleryController = require('./controllers/gallery');


// Configure storage engine
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

var upload = multer({ storage: storage })


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.get('/', picshapeController.welcome);
router.get('/convert', picshapeController.convert);
router.post('/photos/upload', upload.single('photo'), galleryController.handleFileUpload);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port ' + port);
