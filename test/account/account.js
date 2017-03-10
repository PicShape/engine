//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let server = require('../../server');
let chaiHttp = require('chai-http');
let user = require('../../app/models/User.js');
var dotenv = require('dotenv');
var mongoose = require('mongoose');

let should = chai.should();
let expect = chai.expect();

chai.use(chaiHttp);

dotenv.load();

describe('Account management', function() {


  it('/POST /signup must return a token and user information', function(done) {

    chai.request(server)
        .post('/api/account/signup')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ name: 'test',
                email: 'test@test.fr',
                password: 'test' })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.should.have.property('user');
            token = res.body.token;
            done();
          });
  });

  it('/POST /login must return a token and user information', function(done) {

    chai.request(server)
        .post('/api/account/login')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: 'test@test.fr',
                password: 'test' })
        .end(function(err, res) {
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.should.have.property('user');
            res.body.user.should.have.property('_id');
            res.body.user.should.have.property('updatedAt');
            res.body.user.should.have.property('createdAt');
            res.body.user.should.have.property('name');
            res.body.user.should.have.property('email');
            res.body.user.should.have.property('password');
            res.body.user.should.have.property('__v');
            res.body.user.should.have.property('gravatar');
            res.body.user.should.have.property('_id');
            done();
        });
  });

  it('/POST /forgot must confirm mail sending', function(done) {

    chai.request(server)
        .post('/api/account/forgot')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({ email: 'test@test.fr' })
        .end(function(err, res) {
            res.should.have.status(200);
            done();
        });
  });

  it('/DELETE / must confirm account removal', function(done) {

    chai.request(server)
        .delete('/api/account')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', 'token: ' + token)
        .end(function(error, response) {
            response.should.have.status(200);
            done();
        });  });
});
