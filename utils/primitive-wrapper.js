
const spawn = require('child_process').spawn;

exports.primitive = function(inputPath, outputPath, config, callback){
  const args = ['-i', inputPath, '-o', outputPath, '-n', config.iter, '-m', config.mode];
  const primitiveproc = spawn('/usr/local/Cellar/go/1.7.1/libexec/bin/primitive', args);

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
