//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let fs = require('fs');
let path = require('path');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../server');
let should = chai.should();

chai.use(chaiHttp);

/*
  * Test the /GET getPicture
  */
describe('/GET app/api/gallery/photos/', () => {
    it('GET should return picture ', (done) => {

      // var test = fs.createWriteStream('test.jpg');
      // var bla = __dirname + '/../../app/uploads/test.jpg';
      //
      // var path = path.resolve(bla);console.log(path);
      // fs.createReadStream(path).pipe(test);
      // expect(path).to.be.a.file();

      chai.request(server)
          .get('/api/gallery/photos/test')
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
    // it('picture must exist', (done) => {
    //     // res.body.url.to.be.a.path('http://localhost:8080/api/gallery/photos/test.jpg');
    //   });
    });
});
