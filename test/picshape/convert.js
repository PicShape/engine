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
describe('/GET picshape', () => {
    it('it should GET a welcome message', (done) => {
      chai.request(server)
          .get('/api/picshape')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.equals('Welcome to PicShape sub-API !');
            done();
          });
    });
});
