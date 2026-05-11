const express = require('express');
const { connectProducer, sendData } = require('./kafka/producer');

const DATA_SERVICE_URL = process.env.DATA_SERVICE_URL || 'http://data-service:3001';
const app = express();
app.use(express.json());

// POST /api/data – отправка новой порции данных в Kafka
app.post('/api/data', async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || !['post', 'comment'].includes(type)) {
      return res.status(400).json({ error: 'Invalid type. Must be "post" or "comment"' });
    }
    const data = { ...req.body };
    delete data.type;
    await sendData(type, data);
    res.status(202).json({ status: 'accepted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kafka send failed' });
  }
});

// GET /api/search – поиск (прокси на Data Service)
app.get('/api/search', async (req, res) => {
  try {
    const response = await fetch(`${DATA_SERVICE_URL}/search?q=${encodeURIComponent(req.query.q || '')}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Data service unavailable' });
  }
});

// GET /api/reports/:type – отчёты (прокси на Data Service)
app.get('/api/reports/:type', async (req, res) => {
  const allowed = ['top-posts', 'daily-stats', 'top-authors'];
  if (!allowed.includes(req.params.type)) {
    return res.status(400).json({ error: 'Unknown report type' });
  }
  try {
    const response = await fetch(`${DATA_SERVICE_URL}/reports/${req.params.type}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Data service unavailable' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectProducer();
  console.log(`API Service running on port ${PORT}`);
});