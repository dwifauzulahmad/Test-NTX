const { Pool } = require('pg');
const express = require('express');
const app = express();

// Konfigurasi koneksi ke database PostgreSQL
const pool = new Pool({
  user: 'username',
  host: 'localhost',
  database: 'database_name',
  password: 'password',
  port: 5432,
});

// Endpoint untuk mendapatkan jumlah "destinationCountry" dan "sourceCountry"
app.get('/data', async (req, res) => {
  try {
    const query = `
      SELECT type, destinationCountry, sourceCountry, COUNT(*) AS total
      FROM attacks
      GROUP BY type, destinationCountry, sourceCountry
    `;

    const result = await pool.query(query);
    const data = result.rows;

    // Menyusun data sesuai dengan format yang diminta
    const formattedData = {
      success: true,
      statusCode: 200,
      data: {
        label: data.map(item => `${item.destinationCountry}-${item.type}`),
        total: data.map(item => item.total),
      },
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ success: false, statusCode: 500, error: 'Internal Server Error' });
  }
});

// Memulai server
app.listen(3000, () => {
  console.log('Server berjalan pada port 3000');
});
