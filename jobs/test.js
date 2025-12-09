const { spawn } = require('child_process');

function runTest(type = 'all') {
  return new Promise((resolve, reject) => {
    const testType = type === 'unit' ? 'unit' :
      type === 'integration' ? 'integration' :
      'all';

    console.warn(`\n📋 Running ${testType} tests...`);

    const test = spawn('npm', ['run', `test:${testType}`], {
      stdio: 'inherit',
      shell: true
    });

    test.on('close', (code) => {
      if (code === 0) {
        console.warn(`✅ ${testType} tests passed`);
        resolve(true);
      } else {
        console.error(`❌ ${testType} tests failed`);
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
