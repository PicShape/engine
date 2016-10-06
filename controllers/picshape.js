var path = require('path');

const spawn = require('child_process').spawn;


exports.welcome = function(req, res) {
    res.json({ message: 'Welcome to PicShape API!' });
};


exports.convert = function(req, res){
  let inputFile = path.resolve('uploads/' + req.body.imgName);
  let outputFile = path.resolve('uploads/converted-' + req.body.imgName);
  req.assert('imgName', 'imgName cannot be blank').notEmpty();

  const args = ['-i', inputFile, '-o', outputFile, '-n', '100', '-m', '0', '-v'];
  const primitiveproc = spawn('/usr/local/Cellar/go/1.7.1/libexec/bin/primitive', args);

  primitiveproc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  primitiveproc.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  primitiveproc.on('close', (code, callback) => {

    console.log('child process exited with code ' + code);
    console.log('Converted into ' + outputFile);

    res.sendFile(outputFile, function (err) {
       if (err) {
         console.log(err);
         res.status(err.status).end();
       }
       else {
         console.log('Sent:', outputFile);
       }
    });
  });
};
