const {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  importFromCSV,
  importFromJSON,
  importFromExcel,
} = require('../services/exportImportService');
const path = require('path');
const fs = require('fs');

// ===========================
// EXPORT CONTROLLERS
// ===========================

// Eksporto në CSV
const exportCSV = async (req, res) => {
  try {
    const { data, fields } = req.body;
    if (!data || !fields) {
      return res.status(400).json({ message: 'Data and fields are required' });
    }
    const csv = exportToCSV(data, fields);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=export.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eksporto në JSON
const exportJSON = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }
    const json = exportToJSON(data);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=export.json');
    res.status(200).send(json);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eksporto në Excel
const exportExcel = async (req, res) => {
  try {
    const { data, sheetName } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Data is required' });
    }
    const buffer = await exportToExcel(data, sheetName);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
    res.status(200).send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===========================
// IMPORT CONTROLLERS
// ===========================

// Importo nga CSV
const importCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const results = await importFromCSV(req.file.path);
    fs.unlinkSync(req.file.path); // Fshi file-in temp
    res.status(200).json({ message: 'Import successful', data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Importo nga JSON
const importJSON = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const results = importFromJSON(req.file.path);
    fs.unlinkSync(req.file.path); // Fshi file-in temp
    res.status(200).json({ message: 'Import successful', data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Importo nga Excel
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const results = await importFromExcel(req.file.path);
    fs.unlinkSync(req.file.path); // Fshi file-in temp
    res.status(200).json({ message: 'Import successful', data: results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  exportCSV,
  exportJSON,
  exportExcel,
  importCSV,
  importJSON,
  importExcel,
};