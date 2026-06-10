const { Sheet } = require('../models')

const sheetService = {

  createSheet: async (formId, name = 'Untitled Sheet', createdBy = null) => {
    const existing = await Sheet.findOne({ where: { formId } })
    if (existing) return existing
    return await Sheet.create({ formId, name, cells: {}, createdBy })
  },

  getSheet: async (sheetId) => {
    return await Sheet.findByPk(sheetId)
  },

  getSheetByFormId: async (formId) => {
    return await Sheet.findOne({ where: { formId } })
  },

  updateCell: async (sheetId, cellId, value, updatedBy) => {
    const sheet = await Sheet.findByPk(sheetId)
    if (!sheet) return null
    const cells = { ...sheet.cells, [cellId]: { value, updatedBy, updatedAt: new Date() } }
    await sheet.update({ cells })
    return cells[cellId]
  },

  getCell: async (sheetId, cellId) => {
    const sheet = await Sheet.findByPk(sheetId)
    if (!sheet) return null
    return sheet.cells[cellId] || null
  },

  getAllCells: async (sheetId) => {
    const sheet = await Sheet.findByPk(sheetId)
    if (!sheet) return {}
    return sheet.cells
  },

  getAllSheets: async () => {
    return await Sheet.findAll()
  }
}

module.exports = sheetService