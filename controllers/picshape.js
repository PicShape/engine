
const spawn = require('child_process').spawn;


exports.welcome = function(req, res) {
    res.json({ message: 'Welcome to PicShape API!' });
};


exports.convert = function(req, res){
  req.assert('imgName', 'imgName cannot be blank').notEmpty();

  const args = ['-i', 'uploads/' + req.body.imgName, '-o', 'uploads/converted-' + req.body.imgName, '-n', '100', '-m', '0', '-v'];
  const primitiveproc = spawn('/usr/local/Cellar/go/1.7.1/libexec/bin/primitive', args);

  primitiveproc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  primitiveproc.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  primitiveproc.on('close', (code, callback) => {
    console.log(`child process exited with code ${code}`);
    res.json({ message: 'child process exited with code ' + code });
  });
}
