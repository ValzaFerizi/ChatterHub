const ExcelJS = require('exceljs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

// ===========================
// EXPORT FUNCTIONS
// ===========================

// Eksporto të dhëna në CSV
const exportToCSV = (data, fields) => {
  try {
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return csv;
  } catch (error) {
    throw new Error(`CSV export failed: ${error.message}`);
  }
};

// Eksporto të dhëna në JSON
const exportToJSON = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error(`JSON export failed: ${error.message}`);
  }
};

// Eksporto të dhëna në Excel
const exportToExcel = async (data, sheetName = 'Sheet1') => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Shto headers automatikisht nga keys e objektit
    if (data.length > 0) {
      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key: key,
        width: 20,
      }));
    }

    // Shto të dhënat
    data.forEach((row) => worksheet.addRow(row));

    // Stilizo headers
    worksheet.getRow(1).font = { bold: true };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`Excel export failed: ${error.message}`);
  }
};

// ===========================
// IMPORT FUNCTIONS
// ===========================

// Importo të dhëna nga CSV
const importFromCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

// Importo të dhëna nga JSON
const importFromJSON = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(`JSON import failed: ${error.message}`);
  }
};

// Importo të dhëna nga Excel
const importFromExcel = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];
    const results = [];
    const headers = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.values.forEach((header) => {
          if (header) headers.push(header);
        });
      } else {
        const rowData = {};
        row.values.forEach((value, index) => {
          if (headers[index - 1]) {
            rowData[headers[index - 1]] = value;
          }
        });
        results.push(rowData);
      }
    });

    return results;
  } catch (error) {
    throw new Error(`Excel import failed: ${error.message}`);
  }
};

module.exports = {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  importFromCSV,
  importFromJSON,
  importFromExcel,
};