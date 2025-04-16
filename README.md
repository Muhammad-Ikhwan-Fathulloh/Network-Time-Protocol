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

## Prerequisites
- Docker and Docker Compose installed.
- Node.js and npm installed (for the Express.js API bridge).
- Basic knowledge of Docker and JavaScript.

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:
```bash
git clone https://github.com/Muhammad-Ikhwan-Fathulloh/Network-Time-Protocol.git
cd Network-Time-Protocol
```

### 2. Build and Run the NTP Server with Docker Compose

First, ensure Docker and Docker Compose are running on your system. Then, build and start the NTP server container:

```bash
docker-compose up -d --build
```

This will:
- Build the Docker image for the NTP server.
- Start the NTP server container and ensure it's running in the background.

### 3. Install and Set Up the Express.js API Bridge

To create an HTTP bridge for your NTP server, we use Express.js. Follow the steps below to set up the API:

#### a. Install Express.js

In the `ntp-api` folder (located in the root of the project), run the following commands to install the necessary dependencies:

```bash
mkdir ntp-api
cd ntp-api
npm init -y
npm install express ntp-client
```

#### b. Create the API Server

Create the `server.js` file inside the `ntp-api` folder with the following content:

```js
const express = require('express');
const ntpClient = require('ntp-client');

const app = express();
const port = 3000;

// API endpoint to fetch NTP time
app.get('/api/ntp-time', (req, res) => {
  ntpClient.getNetworkTime("127.0.0.1", 123, function(err, date) {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve time from NTP server' });
    }
    res.json({ ntp_time: date });
  });
});

// Run the server on port 3000
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

#### c. Run the API Server

Start the Express server by running:

```bash
node server.js
```

The server will start and be available at `http://localhost:3000`.

---

## Running the NTP Server

To run the NTP server using Docker Compose:

```bash
docker-compose up -d --build
```

This command will:
- Build the NTP server Docker image.
- Start the container running the NTP server.

The NTP server will synchronize time from public NTP servers and expose the NTP service within the container.

---

## Testing the NTP Server from Local Container

To test the NTP server, create a `test-client.sh` script:

```bash
#!/bin/bash

# Run client container to test NTP connection
docker run --rm --network host debian:stable-slim bash -c '
  apt-get update && apt-get install -y ntpdate && \
  ntpdate -q 127.0.0.1
'
```

Run the test:

```bash
chmod +x test-client.sh
./test-client.sh
```

**Note:** The `--network host` option works only on Linux hosts. It does not work on Docker Desktop for Windows/macOS.

---

## Testing the API from JavaScript Client

You can test the NTP time from a browser or JavaScript client by fetching the time from your Express API.

Create an `index.html` file with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NTP Time Test</title>
</head>
<body>
    <h1>NTP Time</h1>
    <p id="ntp-time">Loading...</p>

    <script>
        async function fetchNTPTime() {
            const response = await fetch('http://localhost:3000/api/ntp-time');
            const data = await response.json();
            document.getElementById('ntp-time').innerText = `NTP Time: ${data.ntp_time}`;
        }

        fetchNTPTime();
    </script>
</body>
</html>
```

Open the `index.html` file in a browser. The page should display the NTP time returned by your Express API.

---

## DNS Configuration

Ensure that the domain `ntp.utb-univ.ac.id` points to the public IP of your server. You can do this by adding an A record in your DNS management system.

---

## API Endpoint

### `/api/ntp-time`

- **Method:** GET
- **Description:** Retrieves the current time from the NTP server running in Docker.
- **Response Example:**
  ```json
  {
    "ntp_time": "2025-04-16T12:34:56.000Z"
  }
  ```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:
- The NTP server relies on the `127.0.0.1` address (localhost) within the Docker container. If you want to access it from outside the container, you may need to adjust your network configurations accordingly.
- For production, you may want to use a domain name and configure your server to handle external requests securely (with HTTPS).

---

Let me know if you need any further clarification!