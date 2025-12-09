const { spawn } = require('child_process');

function runDeploy(environment = 'development') {
  return new Promise((resolve, reject) => {
    console.warn(`\n🚀 Deploying to ${environment}...`);

    // Step 1: Build Docker image
    console.warn('  • Building Docker image...');
    const build = spawn('docker', ['build', '-t', `complaints-app:${environment}`, '.'], {
      stdio: 'inherit',
      shell: true
    });

    build.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Docker build failed');
        reject(new Error('Docker build failed'));
        return;
      }

      console.warn('  ✅ Docker build successful');

      // Step 2: Stop existing containers
      console.warn('  • Stopping existing containers...');
      const stop = spawn('docker-compose', ['down'], {
        stdio: 'inherit',
        shell: true
      });

      stop.on('close', (code) => {
        console.warn('  ✅ Containers stopped');

        // Step 3: Start new containers
        console.warn('  • Starting new containers...');
        const start = spawn('docker-compose', ['up', '-d'], {
          stdio: 'inherit',
          shell: true
        });

        start.on('close', (code) => {
          if (code !== 0) {
            console.error('❌ Deployment failed');
            reject(new Error('Deployment failed'));
            return;
          }

          console.warn('  ✅ Containers started');
          console.warn(`✅ Deployment to ${environment} completed successfully`);
          resolve(true);
        });

        start.on('error', (err) => {
          console.error('Error starting containers:', err);
          reject(err);
        });
      });

      stop.on('error', (err) => {
        console.error('Error stopping containers:', err);
        reject(err);
      });
    });

    build.on('error', (err) => {
      console.error('Error building Docker image:', err);
      reject(err);
    });
  });
}

module.exports = { runDeploy };
