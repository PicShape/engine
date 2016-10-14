//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

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
describe('/POST picshape/convert', () => {
    it('it should fail when not providing image', (done) => {
      chai.request(server)
          .post('/api/picshape/convert')
          .end((err, res) => {
              res.should.have.status(400);
            done();
          });
    });
});
