const { runTest } = require('./test');
const { runBuild } = require('./build');
const { runDeploy } = require('./deploy');

async function executeJob(jobName, options = {}) {
  try {
    console.warn(`\n${'='.repeat(50)}`);
    console.warn(`📦 Job: ${jobName}`);
    console.warn(`${'='.repeat(50)}`);

    switch (jobName) {
      case 'test':
        await runTest(options.type || 'all');
        break;

      case 'test:unit':
        await runTest('unit');
        break;

      case 'test:integration':
        await runTest('integration');
        break;

      case 'build':
        await runBuild();
        break;

      case 'deploy':
        await runDeploy(options.env || 'development');
        break;

      case 'ci':
        // Complete CI pipeline
        console.warn('\n🔄 Running complete CI pipeline...\n');
        await runTest('all');
        await runBuild();
        break;

      default:
        throw new Error(`Unknown job: ${jobName}`);
    }

    console.warn(`\n${'='.repeat(50)}`);
    console.warn('✅ Job completed successfully');
    console.warn(`${'='.repeat(50)}\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n${'='.repeat(50)}`);
    console.error('❌ Job failed');
    console.error(`${'='.repeat(50)}`);
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { executeJob };
