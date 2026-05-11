const express = require('express');
const { run } = require('./consumer');
const searchRoutes = require('./routes/search');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3001;

app.use('/search', searchRoutes);
app.use('/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Data Service running on port ${PORT}`);
  run().catch(err => console.error('Kafka consumer error:', err));
});