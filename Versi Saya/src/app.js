import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import pkg from 'pg';
import redis from 'redis';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import fs from 'fs';

const readFileAsync = promisify(fs.readFile);
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const client = redis.createClient();

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'Token Tidak Tersedia' });
  }

  try {
    const decoded = jwt.verify(token, 'fauzul07');
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token salah' });
  }
};

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user.role; 
    if (userRole !== requiredRole) {
      return res.status(403).json({ message: 'Akses ditolak' });
    }
    next();
  };
};

app.get('/data', authMiddleware, async (_req, res) => {
  try {
    const response = await axios.get('https://livethreatmap.radware.com/api/map/attacks?limit=10');
    const dataset = response.data;
    console.log(dataset);

    res.json({ success: true, data: dataset });
  } catch (error) {
    console.error('Erorr Mengambil Data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

io.on('connection', (socket) => {
});

app.get('/data', async (_req, res, next) => {
  const cachedData = await client.get('cached_data');
  if (cachedData) {
    const parsedData = JSON.parse(cachedData);
    return res.json(parsedData);
  }
  next();
});

server.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});