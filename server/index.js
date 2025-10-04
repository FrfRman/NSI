const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Simple cache to avoid rate limits
let tleCache = {
  data: null,
  ts: 0,
  ttl: 60 * 1000 // 60s
};

app.get('/api/tle/:set?', async (req, res) => {
  try {
    const set = req.params.set || 'active';
    const now = Date.now();
    if (tleCache.data && now - tleCache.ts < tleCache.ttl && tleCache.set === set) {
      return res.json({ source: 'cache', data: tleCache.data });
    }

    // CelesTrak TLE sets: active, visual, stations, etc.
    const url = `https://celestrak.org/NORAD/elements/${encodeURIComponent(set)}.txt`;
    const resp = await axios.get(url);
    const raw = resp.data;

    // Parse into objects: name, line1, line2
    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const parsed = [];
    for (let i = 0; i < lines.length; i += 3) {
      const name = lines[i];
      const line1 = lines[i+1];
      const line2 = lines[i+2];
      if (!line1 || !line2) break;
      parsed.push({ name, line1, line2 });
    }

    tleCache = { data: parsed, ts: now, ttl: 60*1000, set };
    res.json({ source: 'celestrak', data: parsed });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch TLE data', details: err.message });
  }
});

app.get('/', (req, res) => res.send('CosmicEye server running'));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
