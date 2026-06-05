const express = require('express');
const router = express.Router();
const {
  generateCSV,
  generateExcel,
  generateJSON,
  getJobStatus,
} = require('../controllers/reportController');

// ===========================
// REPORT ROUTES
// ===========================

// Gjenero raporte
router.post('/reports/csv', generateCSV);
router.post('/reports/excel', generateExcel);
router.post('/reports/json', generateJSON);

// Kontrollo statusin e job-it
router.get('/reports/status/:jobId', getJobStatus);

module.exports = router;