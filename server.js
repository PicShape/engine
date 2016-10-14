// server.js
var mime = require('mime');
var express = require('express');
var expressValidator = require('express-validator');

var app = express();

var bodyParser = require('body-parser');

// Controllers for routing
var picshapeController = require('./controllers/picshape');
var galleryController = require('./controllers/gallery');





// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());


var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
router.use('/gallery', require('./routes/gallery'));
router.use('/picshape', require('./routes/picshape'));

app.use('/api',router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port ' + port);
