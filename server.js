const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.static(__dirname));

app.get('/api/noaa/data', async (req, res) => {
  const token = req.headers['token'];

  if (!token) {
    return res.status(400).json({ error: 'Brak nagłówka token' });
  }

  const queryString = new URLSearchParams(req.query).toString();
  const targetUrl = `https://www.ncei.noaa.gov/cdo-web/api/v2/data?${queryString}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { token }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer i proxy działają pod adresem: http://localhost:${PORT}`);
});