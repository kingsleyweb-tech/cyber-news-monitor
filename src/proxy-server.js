// This runs as a separate server to bypass CORS
const express = require('express');  // It handles receiving requests and sending back responses.
const cors = require('cors');
const axios = require('axios');  // We use it here on the SERVER side to fetch the RSS feeds from external websites

const app = express();
app.use(cors());

app.get('/api/rss', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Proxy server running on http://localhost:3001');
});