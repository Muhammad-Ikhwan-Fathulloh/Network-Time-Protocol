const express = require('express');
const ntpClient = require('ntp-client');
const cors = require('cors');
const moment = require('moment-timezone');
require('dotenv').config(); 

const app = express();
const port = 3000;

app.use(cors());

// Middleware: Bearer Token Authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const VALID_TOKEN = process.env.API_TOKEN;

  if (token === VALID_TOKEN) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing token' });
  }
};

// GET /api/ntp-time
app.get('/api/ntp-time', authenticateToken, (req, res) => {
  const timezone = req.query.timezone || 'UTC';

  ntpClient.getNetworkTime("127.0.0.1", 123, function(err, date) {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve time from NTP server' });
    }

    const convertedTime = moment(date).tz(timezone);
    const datePart = convertedTime.format('YYYY-MM-DD');
    const timePart = convertedTime.format('HH:mm:ss');

    res.json({ ntp_date: datePart, ntp_time: timePart });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});