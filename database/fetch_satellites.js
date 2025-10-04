const axios = require('axios');
const db = require('./db');

async function fetchSatellites() {
  try {
    const res = await axios.get('https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json');
    const sats = res.data;

    for (const s of sats.slice(0, 100)) { // just first 100 for demo
      const query = `
        INSERT INTO satellites_data (name, norad_cat_id, launch_date, object_type, tle_line1, tle_line2, epoch)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          tle_line1 = VALUES(tle_line1),
          tle_line2 = VALUES(tle_line2),
          epoch = VALUES(epoch)
      `;
      db.query(query, [
        s.OBJECT_NAME,
        s.NORAD_CAT_ID,
        s.LAUNCH_DATE || null,
        s.OBJECT_TYPE,
        s.TLE_LINE1,
        s.TLE_LINE2,
        s.EPOCH || null
      ]);
    }

    console.log("✅ Satellite data stored successfully!");
  } catch (err) {
    console.error("❌ Error fetching:", err.message);
  } finally {
    db.end();
  }
}

fetchSatellites();
