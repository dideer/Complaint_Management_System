const { executeJob } = require('./jobs');

const args = process.argv.slice(2);
const jobName = args[0] || 'ci';
const options = {};

// Parse additional options
for (let i = 1; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    const value = args[i + 1];
    options[key] = value;
    i++;
  }
}

executeJob(jobName, options);
