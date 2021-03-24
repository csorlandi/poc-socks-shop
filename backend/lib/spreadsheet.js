const { GoogleSpreadsheet } = require('google-spreadsheet');

const credentials = require('../../google-api-credentials.json');

const document = new GoogleSpreadsheet('1yLcSF2BbQphVFH9oF6v-vEhSarDey1U7qIeqUnR_ukY');

const saveOrder = async (order) => {
  await document.useServiceAccountAuth(credentials);

  await document.loadInfo();

  const sheet = document.sheetsByIndex[1];

  const orderId = order.id;
  const total = order.items.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.price * currentValue.quantity);
  }, 0);

  const rows = order.items.map(item => {
    return {
      'Order': orderId,
      'Client Name': order.name,
      'Client Phone': order.phone,
      'Product': item.name,
      'Quantity': item.quantity,
      'Price': item.price,
      'Subtotal': item.price * item.quantity,
      'Total': total,
      'Status': 'pending',
      'CPF': order.cpf,
    }
  })

  await sheet.addRows(rows);
}

module.exports = { saveOrder };