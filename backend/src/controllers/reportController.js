const reportQueue = require('../jobs/reportQueue');

// ===========================
// SHTO JOB NË QUEUE
// ===========================

// Gjenero raport CSV
const generateCSV = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const job = await reportQueue.add({
      type: 'csv',
      data,
    });

    res.status(200).json({
      message: 'CSV report generation started',
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gjenero raport Excel
const generateExcel = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const job = await reportQueue.add({
      type: 'excel',
      data,
    });

    res.status(200).json({
      message: 'Excel report generation started',
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gjenero raport JSON
const generateJSON = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }

    const job = await reportQueue.add({
      type: 'json',
      data,
    });

    res.status(200).json({
      message: 'JSON report generation started',
      jobId: job.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kontrollo statusin e job-it
const getJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await reportQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job._progress;

    res.status(200).json({
      jobId,
      state,
      progress,
      data: job.data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateCSV,
  generateExcel,
  generateJSON,
  getJobStatus,
};