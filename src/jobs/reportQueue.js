const Bull = require('bull');

// ===========================
// KRIJO QUEUE
// ===========================
const reportQueue = new Bull('report-generation', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
});

// ===========================
// PROCESO JOB-ET
// ===========================
reportQueue.process(async (job) => {
  const { type, data } = job.data;

  console.log(`Processing job: ${job.id} - Type: ${type}`);

  switch (type) {
    case 'csv':
      await generateCSVReport(data);
      break;
    case 'excel':
      await generateExcelReport(data);
      break;
    case 'json':
      await generateJSONReport(data);
      break;
    default:
      throw new Error(`Unknown report type: ${type}`);
  }

  return { success: true, type, jobId: job.id };
});

// ===========================
// GJENERO RAPORTE
// ===========================
const generateCSVReport = async (data) => {
  console.log('Generating CSV report...');
  // Member 2 do të shtojë logjikën e databazës këtu
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('CSV report generated!');
};

const generateExcelReport = async (data) => {
  console.log('Generating Excel report...');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('Excel report generated!');
};

const generateJSONReport = async (data) => {
  console.log('Generating JSON report...');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log('JSON report generated!');
};

// ===========================
// EVENTS
// ===========================
reportQueue.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

reportQueue.on('failed', (job, error) => {
  console.log(`❌ Job ${job.id} failed:`, error.message);
});

reportQueue.on('progress', (job, progress) => {
  console.log(`⏳ Job ${job.id} progress: ${progress}%`);
});

module.exports = reportQueue;