const express = require('express');
const axios = require('axios');
const router = express.Router();

require('dotenv').config();

const API_KEY = process.env.CURRENCYLAYER_API_KEY;

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://apilayer.net/api/live', {
      params: {
        access_key: API_KEY,
        currencies: 'CLP',
        source: 'USD',
        format: 1
      }
    });

    console.log(response.data);

    if (response.data.success) {
      const precioDolar = response.data.quotes.USDCLP;
      const timestamp = response.data.timestamp;
      const fecha = new Date(timestamp * 1000).toISOString().split('T')[0];

      res.json({
        dolar_a_CLP: precioDolar,
        fecha
      });
    } else {
      res.status(500).json({ error: 'API error', info: response.data.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el precio del dólar' });
  }
});

module.exports = router;
