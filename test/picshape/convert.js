//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let fs = require('fs');

chai.use(chaiHttp);
var token;

/*
  * Test the /GET route
  */
describe('/GET picshape/convert', function() {
    it('it should fail on GET', function(done) {

      // We recreate the user for next tests
      chai.request(server)
          .post('/api/account/signup')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .send({ name: 'test',
                  email: 'test@test.fr',
                  password: 'test' })
          .end(function(err, res) {
              token = res.body.token;

              chai.request(server)
                  .get('/api/picshape/convert')
                  .set('Authorization', 'token: ' + token)
                  .end((err, res) => {
                      res.should.have.status(404);
                      done();
                  });
          });
    });
});

/*
  * Test the /POST route
  */
describe('/POST picshape/convert', function(){
    this.timeout(60000);

    it('it should fail when not providing image', function(done) {
      chai.request(server)
          .post('/api/picshape/convert')
          .set('Authorization', 'token: ' + token)
          .end(function(err, res) {
              res.should.have.status(400);
              done();
          });
    });

    it('it should success when providing image. Timeout - 60s', function(done) {
      setTimeout(done, 60000);

      chai.request(server)
          .post('/api/picshape/convert')
          .set('Authorization', 'token: ' + token)
          .attach('photo', fs.readFileSync(__dirname + '/test_patrick.jpg'), 'test_patrick.jpg')
          .end(function(err, res) {
              res.should.have.status(200);

              // We remove the account because we don't need it anymore
              chai.request(server)
                  .delete('/api/account')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('Authorization', 'token: ' + token)
                  .end(function(err, res) {
                    done();
                  });
          });
    });
});
