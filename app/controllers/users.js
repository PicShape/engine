var User = require('../models/User');


exports.getUsers = function(req, res) {
    User.find({}, {id: 1, name: 1, email: 1}, function(err, users) {
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send({users: users});
    });
}

exports.getUserByName = function(req, res) {
    var name = req.params.name;

    User.findOne({name: new RegExp('^'+name+'$', "i")}, function(err, user) {
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send({user: user});
    });
}

exports.getUserById = function(req, res) {
    var id = req.params.id;

    User.findById(id, function(err, user) {
        if (err) {
            res.status(400).send( { errorMessage: 'There have been errors.', errors: err });
            return;
        }
        res.send({user: user});
    });
}
