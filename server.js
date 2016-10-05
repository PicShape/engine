// server.js

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// Controllers for routing
var psController = require('./controllers/picshape');



// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router


router.get('/', psController.welcome);


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server listening on port ' + port);
