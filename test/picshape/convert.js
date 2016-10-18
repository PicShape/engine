//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();
let fs = require('fs');

chai.use(chaiHttp);

/*
  * Test the /GET route
  */
describe('/GET picshape/convert', () => {
    it('it should fail on GET', (done) => {
      chai.request(server)
          .get('/api/picshape/convert')
          .end((err, res) => {
              res.should.have.status(404);
            done();
          });
    });
});

/*
  * Test the /POST route
  */
describe('/POST picshape/convert', function(){
    this.timeout(60000);

    it('it should fail when not providing image', (done) => {
      chai.request(server)
          .post('/api/picshape/convert')
          .end((err, res) => {
              res.should.have.status(400);
            done();
          });
    });

    it('it should success when providing image. Timeout - 60s', (done) => {
      setTimeout(done, 60000);

      chai.request(server)
          .post('/api/picshape/convert')
          .attach('photo', fs.readFileSync(__dirname + '/test_patrick.jpg'), 'test_patrick.jpg')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    });
});
