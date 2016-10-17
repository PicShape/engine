const os = require('os');
const spawn = require('child_process').spawn;

exports.primitive = function(inputPath, outputPath, config, callback){
  var arch = (os.arch() == 'x64' ? 'amd64' : 'i386');

  // Linux by default.
  var system = (
    os.platform() == "win32" ? "win" : (
      os.platform() == "darwin" ? "darwin" : "linux"
    )
  );

  var extension = system == "win" ? ".exe" : "";

  var primitiveBinary = 'primitive' + '-' + system  + '-' + arch + extension;

  console.log(primitiveBinary);
  
  const args = ['-i', inputPath, '-o', outputPath, '-n', config.iter, '-m', config.mode];

  const primitiveproc = spawn(__dirname + '/primitive/' + primitiveBinary, args);

  primitiveproc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  primitiveproc.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  primitiveproc.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    callback(outputPath);
  });
};
