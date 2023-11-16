const Bill = require('../models/bill');
const excel = require('exceljs');

const excelFilePath = 'Votes 2021-2023 (1).xlsx';

async function importData() {
  // Sync the model with the database
  await Bill.sync();

  // Create an Excel workbook
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(excelFilePath);

  // Get the first worksheet
  const worksheet = workbook.getWorksheet(1);

  console.log('total rows: ', worksheet.rowCount);

  // Iterate over rows starting from the second row (assuming the first row contains headers)
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // Extract data from the Excel row
    const id = row.getCell(1).value;
    const name = row.getCell(2).value;
    const knesset_num = row.getCell(3).value;
    const isNum = Number.isInteger(knesset_num)? knesset_num : 25;
    if(name === 'NULL'){
      continue;
    }
    try {
      await Bill.findOrCreate({
            where: { id: id },
            defaults: { name: name, knesset_num: isNum}
          });
    
    
          console.log(`Row ${i - 1} processed successfully.`);
    } catch (error) {
      console.error(`Error inserting row ${i - 1}:`, error);
      return;
    }
  }

  console.log('Data import completed.');
}

module.exports = importData;