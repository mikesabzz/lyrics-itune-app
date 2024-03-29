const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;
require('dotenv').config();
const apiKey = process.env.MUSIXMATCH_API_KEY; 

app.use(express.json());

app.use((req, res, next) => {
  // Set CORS headers to allow requests from any origin
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/lyrics', async (req, res) => {
  const musixmatchApiUrl = 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get';
  const musicApiKey = apiKey;

  const trackName = req.query.track;
  const artistName = req.query.artist;

  try {
    const response = await axios.get(musixmatchApiUrl, {
      params: {
        format: 'json',
        q_track: trackName,
        q_artist: artistName,
        apikey: musicApiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

// Route to fetch iTunes data
app.get('/itunes', async (req, res) => {
  const artistName = req.query.artist;
  const trackName = req.query.track;

  try {
    const response = await axios.get('https://itunes.apple.com/search?', {
      params: {
        term: `${artistName} ${trackName}`,
        media: 'music',
        limit: 1,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching iTunes data:', error.message);
    res.status(500).json({ error: 'Failed to fetch iTunes data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

