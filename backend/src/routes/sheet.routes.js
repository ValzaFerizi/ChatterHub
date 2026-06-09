const express = require('express')
const router = express.Router()
const sheetService = require('../services/sheet.service')

router.get('/', async (req, res) => {
  const sheets = await sheetService.getAllSheets()
  res.json({ sheets })
})

router.get('/:sheetId', async (req, res) => {
  const sheet = await sheetService.getSheet(req.params.sheetId)
  if (!sheet) return res.status(404).json({ message: 'Sheet nuk u gjet!' })
  res.json({ sheet })
})

router.get('/:sheetId/cells', async (req, res) => {
  const cells = await sheetService.getAllCells(req.params.sheetId)
  res.json({ sheetId: req.params.sheetId, cells })
})

router.get('/:sheetId/cells/:cellId', async (req, res) => {
  const cell = await sheetService.getCell(req.params.sheetId, req.params.cellId)
  if (!cell) return res.status(404).json({ message: 'Cell nuk u gjet!' })
  res.json({ cell })
})

module.exports = router