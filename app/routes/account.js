var express = require('express');

var accountController = require('../controllers/account');

// ROUTES FOR OUR API
// =============================================================================
var accountRouter = express.Router(); // get an instance of the express Router

accountRouter.post('/login', accountController.loginPost);
accountRouter.post('/signup', accountController.signupPost);
accountRouter.delete('/', accountController.ensureAuthenticated, accountController.accountDelete);
accountRouter.put('/', accountController.ensureAuthenticated, accountController.accountPut);
accountRouter.post('/forgot', accountController.forgotPost);
accountRouter.post('/reset', accountController.resetPost);

module.exports = accountRouter;
