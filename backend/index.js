const express = require('express');
const cors = require('cors');
const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, '..', '.env.development')
});

const { saveOrder } = require('./lib/spreadsheet');
const { createPixCharge } = require('./lib/pix');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send({ ok: true });
})

app.post('/create-order', async (request, response) => {
  const pixCharge = await createPixCharge(request.body);
  const { qrcode, charge } = pixCharge;

  await saveOrder({ ...request.body, id: charge.txid });

  response.send({ ok: 1, qrcode, charge });
});

app.listen(3001, (error) => {
  if (error) {
    console.log('Servidor não iniciado');
    console.log(error);
  } else {
    console.log('Servidor rodando na porta 3001');
  }
});