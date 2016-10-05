
const spawn = require('child_process').spawn;



exports.primitive = function(callback){
  const args = ['-i uploads/input.jpg', '-o uploads/output.jpg', '-n 100', '-m 0'];
  const primitiveproc = spawn('primitive', args);

  primitiveproc.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  primitiveproc.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  primitiveproc.on('close', (code, callback) => {
    console.log(`child process exited with code ${code}`);
    callback(code);
  });
};
