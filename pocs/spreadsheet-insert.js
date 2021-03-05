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

  await sheet.addRows([
    {
      'Order': 123,
      'Client Name': 'John Doe',
      'Client Phone': '44 444444444',
      'Product': '',
      'Quantity': 4,
      'Subtotal': 20,
      'Price': 15.55,
      'Status': 'pending',
    }
  ]);
}

run();