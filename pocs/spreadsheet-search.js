const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.development') });

const fs = require('fs');
const { GoogleSpreadsheet } = require('google-spreadsheet');

const credentials = require('../google-api-credentials.json');

const document = new GoogleSpreadsheet('1yLcSF2BbQphVFH9oF6v-vEhSarDey1U7qIeqUnR_ukY');

const run = async () => {
  await document.useServiceAccountAuth(credentials);

  await document.loadInfo();

  const sheet = document.sheetsByIndex[1];

  const totalRows = sheet.rowCount;

  await sheet.loadCells(`A1:A${totalRows}`);
  await sheet.loadCells(`H1:H${totalRows}`);

  const validIndexes = [...Array(totalRows - 1).keys()];

  const orderId = 123;
  const newStatus = 'paid with pix';

  for await (const i of validIndexes) {
    const cell = await sheet.getCell(1 + i, 0);

    if (cell.value) {
      if (cell.value === orderId) {
        console.log('value: ', cell.value);

        const statusCell = await sheet.getCell(i + 1, 7);

        statusCell.value = newStatus;
      }
    } else {
      break;
    }
  }

  await sheet.saveUpdatedCells();
}

run();