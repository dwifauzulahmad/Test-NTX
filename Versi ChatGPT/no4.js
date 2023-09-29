const redis = require('redis');
const client = redis.createClient();

// Middleware untuk caching dengan Redis
const cacheMiddleware = (req, res, next) => {
  const key = req.url;

  // Coba mengambil data dari cache
  client.get(key, (err, data) => {
    if (err) throw err;

    // Jika data ada dalam cache, kirimkan sebagai respons
    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      // Jika data tidak ada dalam cache, lanjutkan ke handler
      next();
    }
  });
};

// Gunakan middleware caching pada endpoint /data
app.get('/data', cacheMiddleware, async (req, res) => {
  // ...
});
