const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Serwowanie plików HTML/CSS/JS z bieżącego katalogu
app.use(express.static(__dirname));

// Endpoint proxy dla /datasets
app.get('/api/noaa/datasets', async (req, res) => {
  const token = req.headers['token'];
  const limit = req.query.limit || 50;

  if (!token) {
    return res.status(400).json({ error: 'Brak nagłówka token' });
  }

  try {
    const response = await fetch(`https://www.ncei.noaa.gov/cdo-web/api/v2/datasets?limit=${limit}`, {
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