const sheets = new Map();

const sheetService = {
  // Krijo sheet të ri
  createSheet: (sheetId) => {
    if (!sheets.has(sheetId)) {
      sheets.set(sheetId, {
        id: sheetId,
        cells: {},
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    return sheets.get(sheetId);
  },

  // Merr sheet-in
  getSheet: (sheetId) => {
    return sheets.get(sheetId) || null;
  },

  // Përditëso një cell
  updateCell: (sheetId, cellId, value, updatedBy) => {
    if (!sheets.has(sheetId)) {
      sheetService.createSheet(sheetId);
    }

    const sheet = sheets.get(sheetId);
    sheet.cells[cellId] = {
      value,
      updatedBy,
      updatedAt: new Date()
    };
    sheet.updatedAt = new Date();

    return sheet.cells[cellId];
  },

  // Merr një cell specifike
  getCell: (sheetId, cellId) => {
    const sheet = sheets.get(sheetId);
    if (!sheet) return null;
    return sheet.cells[cellId] || null;
  },

  // Merr të gjitha cells e sheet-it
  getAllCells: (sheetId) => {
    const sheet = sheets.get(sheetId);
    if (!sheet) return {};
    return sheet.cells;
  }
};

module.exports = sheetService;