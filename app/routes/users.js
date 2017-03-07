var express = require('express');

var usersController = require('../controllers/users');

// ROUTES FOR OUR API
// =============================================================================
var usersRouter = express.Router(); // get an instance of the express Router

usersRouter.get('/', usersController.getUsers);
usersRouter.get('/:name', usersController.getUserByName);
usersRouter.get('/:id/id', usersController.getUserById);

module.exports = usersRouter;
