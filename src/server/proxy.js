import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send('URL parameter is required');
    }
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.send(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send(`Proxy error: ${error.message}`);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});