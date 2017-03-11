var User = require('../models/User');


/**
 * Retrieves all users
 */
exports.getUsers = function(req, res) {
    User.find({}, {id: 1, name: 1, email: 1})
    .sort({name: 1})
    .exec(function(err, users) {
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send({users: users});
    });
};

exports.getUserByName = function(req, res) {
    var name = req.params.name;

    User.find({name: new RegExp('^'+name+'', "i")})
    .sort({name: 1})
    .exec(function(err, users) {
        if (err) {
            res.status(400).send( { errorMessage: 'Error gathering users by name.', errors: err });
            return;
        }
        res.send({users: users});
    });
};

exports.getUserById = function(req, res) {
    var id = req.params.id;

    User.findById(id, function(err, user) {
        if (err) {
            res.status(400).send( { errorMessage: 'Error gathering users by id.', errors: err });
            return;
        }
        res.send({user: user});
    });
};
