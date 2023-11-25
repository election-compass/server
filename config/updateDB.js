const excel = require('exceljs');
const db = require('../util/database');

exports.updateBillsTable = async function (path) {

// Create an Excel workbook from given path
    const workbook = new excel.Workbook();
    await workbook.xlsx.readFile(path);

     // Get the first worksheet
  const worksheet = workbook.getWorksheet(1);

  // Iterate over rows starting from the second row (assuming the first row contains headers)
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // Extract data from the Excel row
    const billId = row.getCell(1).value;
    const billName = row.getCell(2).value;
    const knessetNum = row.getCell(3).value;
    const isNum = Number.isInteger(knessetNum)? knessetNum : 25;
    console.log(billId, billName, knessetNum, isNum)
    if(billName === 'NULL'){
      continue;
    }
    try {
      const query = `
      INSERT INTO bills (billId, billName, knessetNum)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE billName = VALUES(billName), knessetNum = VALUES(knessetNum)
    `;
      await db.execute(query, [billId, billName, isNum]);
    } catch (error) {
      console.error(`Error inserting row ${i - 1}:`, error);
      return;
    }
  }

  console.log('Data import completed.');
}

exports.updateVotesTable = async function (path) {

  // Create an Excel workbook from given path
      const workbook = new excel.Workbook();
      await workbook.xlsx.readFile(path);
  
       // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);
  
    // Iterate over rows starting from the second row (assuming the first row contains headers)
    for (let i = 2; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);
  
      // Extract data from the Excel row
      const billId = row.getCell(1).value;
      const mkId = row.getCell(2).value;
      const mkName = row.getCell(3).value;
      const vote = row.getCell(4).value;
      console.log(billId, mkId, mkName, vote)
      if(billId === 'NULL' || mkId === 'NULL' || mkName === 'NULL' || vote === 'NULL'){
        continue;
      }

      try {
        const query = `
        INSERT INTO votes (billId, mkId, mkName, vote) VALUES (?, ?, ?, ?)`;
        await db.execute(query, [billId, mkId, mkName, vote]);
      } catch (error) {
        console.error(`Error inserting row ${i - 1}:`, error);
        return;
      }
    }
  
    console.log('Data import completed.');
  }
