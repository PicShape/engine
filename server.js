// server.js
var mime = require('mime');
var express = require('express');
var expressValidator = require('express-validator');

var app = express();

var bodyParser = require('body-parser');

// Controllers for routing
var picshapeController = require('./app/controllers/picshape');
var galleryController = require('./app/controllers/gallery');





// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

        next();
});

app.set('port', (process.env.PORT || 8080)); // Set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
router.use('/gallery', require('./app/routes/gallery'));
router.use('/picshape', require('./app/routes/picshape'));
router.use('/account', require('./app/routes/account'));

app.use('/api',router);

// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



module.exports = app; // for testing
