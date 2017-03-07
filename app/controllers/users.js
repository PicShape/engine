var User = require('../models/User');


exports.getUsers = function(req, res) {
    User.find({}, {id: 1, name: 1, email: 1}, function(err, users) {
        res.send({users: users});
    })
}

exports.getUserByName = function(req, res) {
    var name = req.params.name;

    User.findOne({name: new RegExp('^'+name+'$', "i")}, function(err, user) {
        res.send({user: user});
    })
}

exports.getUserById = function(req, res) {
    var id = req.params.id;

    User.findById(id, function(err, user) {
        res.send({user: user});
    })
}
