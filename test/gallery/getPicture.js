//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let fs = require('fs');
let path = require('path');

//Require the dev-dependencies
let chai = require('chai');
let chaiFs = require('chai-fs');
let chaiHttp = require('chai-http');
let server = require('../../server');
var rimraf = require('rimraf');
let should = chai.should();

chai.use(chaiHttp);
chai.use(chaiFs);
/*
  * Test the /GET getPicture
  */
describe('/GET app/api/gallery/photos/:user/:id', () => {
    it('GET should return the picture ', (done) => {

      var uploadDir = __dirname + '/../../app/uploads';
      var userUploadDir = uploadDir + "/test";
      uploadDir = path.resolve(uploadDir);
      userUploadDir = path.resolve(userUploadDir);
      // We check if uploads directiry exists. If not, we create it
      if(!fs.existsSync(uploadDir)) {
          console.log('Creating', uploadDir);
          fs.mkdirSync(uploadDir);
      }

      if(!fs.existsSync(userUploadDir)) {
          console.log('Creating', userUploadDir);
          fs.mkdirSync(userUploadDir);
      }

      var test = __dirname + '/test.jpg';
      test = path.resolve(test);
      console.log(test);
      var newDestination = userUploadDir + '/test.jpg';
      newDestination = path.resolve(newDestination);

      // We copy the file
      var inStr = fs.createReadStream(test);
      var outStr = fs.createWriteStream(newDestination);
      inStr.pipe(outStr);

      chai.expect(newDestination).to.be.a.file();
      console.log(newDestination);

      chai.request(server)
          .get('/api/gallery/photos/test/test')
          .end((err, res) => {
              res.should.have.status(200);
              fs.unlink(newDestination);

              rimraf(uploadDir, function () {
                done();
              });
          });
    });
});
