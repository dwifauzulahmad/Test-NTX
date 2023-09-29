const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set interval untuk memfetch data setiap 3 menit
setInterval(async () => {
  try {
    const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
    const data = response.data;

    // Mengirim data ke semua klien yang terhubung melalui WebSocket
    io.emit('data', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}, 180000); // Setiap 3 menit

// Menjalankan server WebSocket
server.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
