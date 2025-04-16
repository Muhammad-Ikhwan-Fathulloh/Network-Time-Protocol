Tentu! Berikut adalah versi **README.md** yang telah diperbarui agar sesuai dengan **kode terbaru** yang memisahkan `date` dan `time`, menggunakan `moment-timezone`, dan mendukung parameter `timezone`.

---

```md
# NTP Server with Docker and API Bridge

This project demonstrates how to run an NTP server inside Docker, create an API bridge using Express.js to fetch NTP time, and access the time from a browser or JavaScript client. The goal is to provide accurate time synchronization without relying on local system time, ensuring the time cannot be manipulated by local devices.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Instructions](#setup-instructions)
3. [Running the NTP Server](#running-the-ntp-server)
4. [Testing the NTP Server from Local Container](#testing-the-ntp-server-from-local-container)
5. [Testing the API from JavaScript Client](#testing-the-api-from-javascript-client)
6. [DNS Configuration](#dns-configuration)
7. [API Endpoint](#api-endpoint)

---

## Prerequisites
- Docker and Docker Compose installed.
- Node.js and npm installed (for the Express.js API bridge).
- Basic knowledge of Docker and JavaScript.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Muhammad-Ikhwan-Fathulloh/Network-Time-Protocol.git
cd Network-Time-Protocol
```

### 2. Build and Run the NTP Server with Docker Compose

```bash
docker-compose up -d --build
```

This will:
- Build the Docker image for the NTP server.
- Start the NTP server container and ensure it's running in the background.

---

## 3. Set Up the Express.js API Bridge

### a. Create API Folder

```bash
mkdir ntp-api
cd ntp-api
```

### b. Initialize and Install Dependencies

```bash
npm init -y
npm install express ntp-client moment-timezone cors
```

### c. Create the `server.js` File

```js
// server.js
const express = require('express');
const ntpClient = require('ntp-client');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/ntp-time', (req, res) => {
  const timezone = req.query.timezone || 'UTC';

  ntpClient.getNetworkTime("127.0.0.1", 123, function(err, date) {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve time from NTP server' });
    }

    const convertedDate = moment(date).tz(timezone);
    const dateOnly = convertedDate.format('YYYY-MM-DD');
    const timeOnly = convertedDate.format('HH:mm:ss');

    res.json({ date: dateOnly, time: timeOnly });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

### d. Run the API Server

```bash
node server.js
```

---

## Running the NTP Server

```bash
docker-compose up -d --build
```

This will start the NTP server that listens on port 123 inside the container and syncs time from external NTP sources.

---

## Testing the NTP Server from Local Container

Create a `test-client.sh` script:

```bash
#!/bin/bash

docker run --rm --network host debian:stable-slim bash -c '
  apt-get update && apt-get install -y ntpdate && \
  ntpdate -q 127.0.0.1
'
```

Run it:

```bash
chmod +x test-client.sh
./test-client.sh
```

> ⚠️ Note: `--network host` only works on Linux. For macOS/Windows, you’ll need to expose ports differently.

---

## Testing the API from JavaScript Client

Create a file named `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NTP Time Test</title>
</head>
<body>
  <h1>NTP Time</h1>
  <p id="ntp-date">Loading date...</p>
  <p id="ntp-time">Loading time...</p>

  <script>
    async function fetchNTPTime() {
      const response = await fetch('http://localhost:3000/api/ntp-time?timezone=Asia/Jakarta');
      const data = await response.json();
      document.getElementById('ntp-date').innerText = `Date: ${data.date}`;
      document.getElementById('ntp-time').innerText = `Time: ${data.time}`;
    }

    fetchNTPTime();
  </script>
</body>
</html>
```

Open the file in a browser. You’ll see the date and time synced from the NTP server.

---

## DNS Configuration

If deploying publicly, configure your domain's DNS A record to point to the public IP of your API server. Example: `ntp.domain.com → your-server-ip`.

---

## API Endpoint

### `GET /api/ntp-time`

**Query Parameters:**
- `timezone`: Optional. Timezone string (e.g., `Asia/Jakarta`, `UTC`, etc.)

**Example Request:**
```
GET http://localhost:3000/api/ntp-time?timezone=Asia/Jakarta
```

**Response:**
```json
{
  "date": "2025-04-16",
  "time": "19:45:12"
}
```

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---

Need help? Feel free to open an issue or contact the maintainer.