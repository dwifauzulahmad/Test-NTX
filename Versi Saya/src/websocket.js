import socketIo from 'socket.io';
import axios from 'axios';
import server from './app';

const io = socketIo(server);

io.on('connection', (socket) => {
  const fetchData = async () => {
    try {
      const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
      const data = response.data;
      socket.emit('data', data);
    } catch (error) {
      console.error('Error Mengambil Data:', error);
    }
  };

  fetchData();

  const intervalId = setInterval(fetchData, 180000);

  socket.on('disconnect', () => {
    clearInterval(intervalId);
  });
});

module.exports = io;