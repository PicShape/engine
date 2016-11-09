var async = require('async');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var User = require('../models/User');
var mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API, domain: process.env.MAILGUN_DOMAIN});


function generateToken(user) {
    var payload = {
        iss: 'picshape',
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

/**
* Login required middleware
*/
exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

/**
* POST /login
* Sign in with email and password
*/
exports.loginPost = function(req, res, next) {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('email', 'Email cannot be blank').notEmpty();
    req.checkBody('password', 'Password cannot be blank').notEmpty();
    req.sanitizeBody('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. ' +
            'Double-check your email address and try again.'
        });
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
            return res.status(401).send({ msg: 'Invalid email or password' });
        }
        res.send({ token: generateToken(user), user: user.toJSON() });
    });
});
};

/**
* POST /signup
*/
exports.signupPost = function(req, res, next) {
    req.checkBody('name', 'Name cannot be blank').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('email', 'Email cannot be blank').notEmpty();
    req.checkBody('password', 'Password must be at least 4 characters long').len(4);
    req.sanitizeBody('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    /* Attention à bien répercuter les modifications à tout les modules d'authentification */
    User.findOne({ email: req.body.email }, function(err, user) {
        if (user) {
            return res.status(400).send({ msg: 'The email address you have entered is already associated with another account.' });
        }
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        user.save(function(err) {
            res.send({ token: generateToken(user), user: user });
        });

    });
};


/**
* PUT /account
* Update profile information OR change password.
*/
exports.accountPut = function(req, res, next) {
    if ('password' in req.body) {
        req.checkBody('password', 'Password must be at least 4 characters long').len(4);
        req.checkBody('confirm', 'Passwords must match').equals(req.body.password);
    } else {
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('email', 'Email cannot be blank').notEmpty();
        req.sanitizeBody('email').normalizeEmail({ remove_dots: false });
    }

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    User.findById(req.user.id, function(err, user) {
        if ('password' in req.body) {
            user.password = req.body.password;
        } else {
            user.email = req.body.email;
            user.name = req.body.name;
            user.gender = req.body.gender;
            user.location = req.body.location;
            user.website = req.body.website;
        }
        user.save(function(err) {
            if ('password' in req.body) {
                res.send({ msg: 'Your password has been changed.' });
            } else if (err && err.code === 11000) {
                res.status(409).send({ msg: 'The email address you have entered is already associated with another account.' });
            } else {
                res.send({ user: user, msg: 'Your profile information has been updated.' });
            }
        });
    });
};

/**
* DELETE /account
*/
exports.accountDelete = function(req, res, next) {
    if(!req.user) {
        res.status(401).send({ msg: 'User requested not valid.' });
        return;
    }
    User.remove({ _id: req.user.id }, function(err) {
        res.send({ msg: 'Your account has been permanently deleted.' });
    });
};

/**
* POST /forgot
*/
exports.forgotPost = function(req, res, next) {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('email', 'Email cannot be blank').notEmpty();
    req.sanitizeBody('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    async.waterfall([
        function(done) {
            crypto.randomBytes(16, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    return res.status(400).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account.' });
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var mailOptions = {
                to: user.email,
                from: 'picshape@benjamindebotte.me',
                subject: '✔ Reset your password on PicShape',
                text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.origin + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };

            mailgun.messages().send(mailOptions, function (error, body) {
                res.send({ msg: 'An email has been sent to ' + user.email + ' with further instructions.' });
                done(error);
            });
        }
    ]);
};

/**
* POST /reset
*/
exports.resetPost = function(req, res, next) {
    req.checkBody('password', 'Password must be at least 4 characters long').len(4);
    req.checkBody('confirm', 'Passwords must match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    async.waterfall([
        function(done) {
            User.findOne({ passwordResetToken: req.params.token })
            .where('passwordResetExpires').gt(Date.now())
            .exec(function(err, user) {
                if (!user) {
                    return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save(function(err) {
                    done(err, user);
                });
            });
        },
        function(user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            });
            var mailOptions = {
                from: 'picshape@benjamindebotte.me',
                to: user.email,
                subject: 'Your PicShape password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            mailgun.messages().send(mailOptions, function (error, body) {
                res.send({ msg: 'Your password has been changed successfully.' });
                done(error);
            });
        }
    ]);
};
