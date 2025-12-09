const { spawn } = require('child_process');

function runBuild() {
  return new Promise((resolve, reject) => {
    console.warn('\n🔨 Building application...');

    // Step 1: Lint code
    console.warn('  • Running ESLint...');
    const lint = spawn('npm', ['run', 'lint'], {
      stdio: 'inherit',
      shell: true
    });

    lint.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Linting failed');
        reject(new Error('Linting failed'));
        return;
      }

      console.warn('  ✅ ESLint passed');

      // Step 2: Run tests
      console.warn('  • Running tests...');
      const test = spawn('npm', ['run', 'test:all'], {
        stdio: 'inherit',
        shell: true
      });

      test.on('close', (code) => {
        if (code !== 0) {
          console.error('❌ Tests failed');
          reject(new Error('Tests failed'));
          return;
        }

        console.warn('  ✅ Tests passed');

        // Step 3: Build Docker image
        console.warn('  • Building Docker image...');
        const docker = spawn('docker', ['build', '-t', 'complaints-app:latest', '.'], {
          stdio: 'inherit',
          shell: true
        });

        docker.on('close', (code) => {
          if (code !== 0) {
            console.error('❌ Docker build failed');
            reject(new Error('Docker build failed'));
            return;
          }

          console.warn('  ✅ Docker build successful');
          console.warn('✅ Build completed successfully');
          resolve(true);
        });

        docker.on('error', (err) => {
          console.error('Error building Docker image:', err);
          reject(err);
        });
      });

      test.on('error', (err) => {
        console.error('Error running tests:', err);
        reject(err);
      });
    });

    lint.on('error', (err) => {
      console.error('Error running lint:', err);
      reject(err);
    });
  });
}

module.exports = { runBuild };
