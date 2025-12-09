const { spawn } = require('child_process');

function runTest(type = 'all') {
  return new Promise((resolve, reject) => {
    const testCmd = type === 'unit' ? 'npm run test:unit' :
                    type === 'integration' ? 'npm run test:integration' :
                    'npm run test:all';

    console.warn(`\n📋 Running ${type} tests...`);

    const test = spawn('npm', ['run', `test:${type === 'all' ? 'all' : type}`], {
      stdio: 'inherit',
      shell: true
    });

    test.on('close', (code) => {
      if (code === 0) {
        console.warn(`✅ ${type} tests passed`);
        resolve(true);
      } else {
        console.error(`❌ ${type} tests failed`);
        reject(new Error(`Tests failed with code ${code}`));
      }
    });

    test.on('error', (err) => {
      console.error('Error running tests:', err);
      reject(err);
    });
  });
}

module.exports = { runTest };
