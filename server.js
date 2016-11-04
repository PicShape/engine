// server.js
var mime = require('mime');
var express = require('express');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var cookieParser = require('cookie-parser');


var app = express();

var bodyParser = require('body-parser');

// Controllers for routing
var picshapeController = require('./app/controllers/picshape');
var galleryController = require('./app/controllers/gallery');


// Load environment variables from .env file
dotenv.load();


// ES6 Transpiler
require('babel-core/register');
require('babel-polyfill');

// Models
var User = require('./app/models/User');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());


app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

        next();
});


app.use(function(req, res, next) {
    req.isAuthenticated = function() {
        var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET);
        } catch (err) {
            return false;
        }
    };


    if (req.isAuthenticated()) {
        var payload = req.isAuthenticated();
        User.findById(payload.sub, function(err, user) {
            req.user = user;
            next();
        });
    } else {
        next();
    }
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

mongoose.connect(process.env.MONGODB);
mongoose.connection.on('error', function(err) {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running (' + err + ')');
    process.exit(1);
});


// START THE SERVER
// =============================================================================
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



module.exports = app; // for testing
