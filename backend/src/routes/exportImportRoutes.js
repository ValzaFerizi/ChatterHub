const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
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
router.post('/csv', exportCSV);
router.post('/json', exportJSON);
router.post('/excel', exportExcel);

// ===========================
// IMPORT ROUTES
// ===========================
router.post('/import/csv', verifyToken, upload.single('file'), importCSV);
router.post('/import/json', verifyToken, upload.single('file'), importJSON);
router.post('/import/excel', verifyToken, upload.single('file'), importExcel);

module.exports = router;
