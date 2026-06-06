const express = require('express');
const router = express.Router();
const sheetService = require('../services/sheet.service');

// Merr të gjitha cells të një sheet-i
router.get('/:sheetId/cells', (req, res) => {
  const { sheetId } = req.params;
  const cells = sheetService.getAllCells(sheetId);
  res.json({ sheetId, cells });
});

// Merr një cell specifike
router.get('/:sheetId/cells/:cellId', (req, res) => {
  const { sheetId, cellId } = req.params;
  const cell = sheetService.getCell(sheetId, cellId);
  if (!cell) {
    return res.status(404).json({ message: 'Cell nuk u gjet!' });
  }
  res.json({ sheetId, cellId, cell });
});

// Merr sheet-in e plotë
router.get('/:sheetId', (req, res) => {
  const { sheetId } = req.params;
  const sheet = sheetService.getSheet(sheetId);
  if (!sheet) {
    return res.status(404).json({ message: 'Sheet nuk u gjet!' });
  }
  res.json({ sheet });
});

module.exports = router;