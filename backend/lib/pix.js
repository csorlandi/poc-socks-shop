const path = require('path');

console.log(process.env.GN_ENV);

const https = require('https');
const axios = require('axios');
const fs = require('fs');

const apiProduction = 'https://api-pix.gerencianet.com.br';
const apiStaging = 'https://api-pix-h.gerencianet.com.br';

const baseUrl = process.env.GN_ENV === 'producao' ? apiProduction : apiStaging;

const getToken = async () => {
  // Load certificate from file located in root dir
  const certificate =
    fs.readFileSync(path.resolve(__dirname, '..', '..', process.env.GN_CERTIFICATE));

  // Create an object to avoid env variables repeat
  const credentials = {
    client_id: process.env.GN_CLIENT_ID,
    client_secret: process.env.GN_CLIENT_SECRET,
  };

  // String to indicate what data you want to return from the pix
  const data = JSON.stringify({ grant_type: 'client_credentials' });

  // Create authentication data and format to a base64 string
  const credentialsData = `${credentials.client_id}:${credentials.client_secret}`;
  const auth = Buffer.from(credentialsData).toString('base64');

  // Create a HTTPS Agent to indicate who you are to api
  const httpsAgent = new https.Agent({
    pfx: certificate,
    passphrase: '',
  });

  // Create aconfig object to send axios requests correctly
  const config = {
    method: 'POST',
    url: `${baseUrl}/oauth/token`,
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    httpsAgent,
    data,
  };

  // Send the request with axios using previous config object
  const result = await axios(config);

  return result.data;
}

const createCharge = async (accessToken, chargeData) => {
  // Load certificate from file located in root dir
  const certificate =
  fs.readFileSync(path.resolve(__dirname, '..', '..', process.env.GN_CERTIFICATE));

  // String to indicate what data you want to return from the pix
  const data = JSON.stringify(chargeData);

  // Create a HTTPS Agent to indicate who you are to api
  const httpsAgent = new https.Agent({
    pfx: certificate,
    passphrase: '',
  });

  // Create aconfig object to send axios requests correctly
  const config = {
    method: 'POST',
    url: `${baseUrl}/v2/cob`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpsAgent,
    data,
  };

  // Send the request with axios using previous config object
  const result = await axios(config);

  return result.data;
}

const getLoc = async (accessToken, locId) => {
  // Load certificate from file located in root dir
  const certificate =
  fs.readFileSync(path.resolve(__dirname, '..', '..', process.env.GN_CERTIFICATE));

  // Create a HTTPS Agent to indicate who you are to api
  const httpsAgent = new https.Agent({
    pfx: certificate,
    passphrase: '',
  });

  // Create aconfig object to send axios requests correctly
  const config = {
    method: 'GET',
    url: `${baseUrl}/v2/loc/${locId}/qrcode`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    httpsAgent,
  };

  // Send the request with axios using previous config object
  const result = await axios(config);

  return result.data;
}

const createPixCharge = async () => {
  const pixKey = process.env.PIX_KEY;
  const { access_token } = await getToken();

  const chargeData = {
    calendario: {
      expiracao: 3600,
    },
    devedor: {
      cpf: '12345678909',
      nome: 'Claudio Orlandi',
    },
    valor: {
      original: '130.50',
    },
    chave: pixKey,
    solicitacaoPagador: 'Cobrança dos serviços prestados',
  };

  const charge = await createCharge(access_token, chargeData);

  const qrcode = await getLoc(access_token, charge.loc.id);

  return { qrcode, charge };
}

module.exports = { createPixCharge };