const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  exportCSV,
  exportJSON,
  exportExcel,
  importCSV,
  importJSON,
  importExcel,
} = require('../controllers/exportImportController');

// Konfiguro multer për file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// ===========================
// EXPORT ROUTES
// ===========================
router.post('/export/csv', exportCSV);
router.post('/export/json', exportJSON);
router.post('/export/excel', exportExcel);

// ===========================
// IMPORT ROUTES
// ===========================
router.post('/import/csv', upload.single('file'), importCSV);
router.post('/import/json', upload.single('file'), importJSON);
router.post('/import/excel', upload.single('file'), importExcel);

module.exports = router;