// server.js
const express = require('express');
const ntpClient = require('ntp-client');
const cors = require('cors'); // Import cors
const moment = require('moment-timezone'); // Import moment-timezone

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// API endpoint to fetch NTP time
app.get('/api/ntp-time', (req, res) => {
  // Get timezone from query parameter, default to 'UTC' if not provided
  const timezone = req.query.timezone || 'UTC';

  ntpClient.getNetworkTime("127.0.0.1", 123, function(err, date) {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve time from NTP server' });
    }

    // Convert NTP time to user's timezone
    const convertedTime = moment(date).tz(timezone);

    // Extract date and time separately
    const datePart = convertedTime.format('YYYY-MM-DD');
    const timePart = convertedTime.format('HH:mm:ss');

    // Send back the separate date and time
    res.json({ ntp_date: datePart, ntp_time: timePart });
  });
});

// Run the server on port 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});