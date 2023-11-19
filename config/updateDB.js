const Bill = require('../models/Bill');
const Vote = require('../models/Vote');
const excel = require('exceljs');

const billsFile = 'Votes 2021-2023 (1).xlsx';
const votesFile = 'Votes 2021-2023 (3).xlsx';

exports.billsScript = async function () {
  // Sync the model with the database
  await Bill.sync();

  // Create an Excel workbook
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(billsFile);

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

exports.votingScript = async function () {
  // Sync the model with the database
  await Vote.sync();

  // Create an Excel workbook
  const workbook = new excel.Workbook();
  await workbook.xlsx.readFile(votesFile);

  // Get the first worksheet
  const worksheet = workbook.getWorksheet(1);

  console.log('total rows: ', worksheet.rowCount);

  // Iterate over rows starting from the second row (assuming the first row contains headers)
  for (let i = 2; i <= worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);

    // Extract data from the Excel row
    const bill_id = row.getCell(1).value;
    const mk_id = row.getCell(2).value;
    const mk_name = row.getCell(3).value;
    const vote = row.getCell(4).value;
    if(bill_id === 'NULL' || mk_id === 'NULL' || mk_name === 'NULL' || vote === 'NULL'){
      continue;
    }
    try {
      await Vote.findOrCreate({
            where: { billId: bill_id, mkId: mk_id },
            defaults: { mkName: mk_name, mkVote: vote}
          });
    
    
          console.log(`Row ${i - 1} processed successfully.`);
    } catch (error) {
      console.error(`Error inserting row ${i - 1}:`, error);
      return;
    }
  }

  console.log('Data import completed.');
}

