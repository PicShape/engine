var User = require('../models/User');


/**
 * Retrieves all users
 */
exports.getUsers = function(req, res) {
    User.find({}, {id: 1, name: 1, gravatar: 1})
    .sort({name: 1})
    .exec(function(err, users) {
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send({users: users});
    });
};

/**
 * Retrieves all user starting by 'name' (case insensitive)
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.getUserByName = function(req, res) {
    var name = req.params.name;

    User.find({name: new RegExp('^'+name+'', "i")},{id: 1, name: 1, gravatar: 1})
    .sort({name: 1})
    .exec(function(err, users) {
        if (err) {
            res.status(400).send( { errorMessage: 'Error gathering users by name.', errors: err });
            return;
        }
        res.send({users: users});
    });
};

/**
 * Retrieves user with given ID
 */
exports.getUserById = function(req, res) {
    var id = req.params.id;

    User.findById(id,{id: 1, name: 1, gravatar: 1}, function(err, user) {
        if (err) {
            res.status(400).send( { errorMessage: 'Error gathering users by id.', errors: err });
            return;
        }
        res.send({user: user});
    });
};
