
const spawn = require('child_process').spawn;


const args = ['-i uploads/input.jpg', '-o uploads/output.jpg', '-n 100', '-m 0'];
const primitive = spawn('primitive', args);

primitive.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

primitive.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

primitive.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
