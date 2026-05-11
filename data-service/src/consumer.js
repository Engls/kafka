const { Kafka } = require('kafkajs');
const pool = require('./db');

const kafka = new Kafka({
  clientId: 'data-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});
const consumer = kafka.consumer({ groupId: 'social-group' });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'social-data', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = JSON.parse(message.value.toString());
      const { type, ...data } = value;
      try {
        if (type === 'post') {
          await pool.query(
            'INSERT INTO posts (content, author, created_at) VALUES ($1, $2, NOW())',
            [data.content, data.author]
          );
        } else if (type === 'comment') {
          await pool.query(
            'INSERT INTO comments (post_id, text, author, created_at) VALUES ($1, $2, $3, NOW())',
            [data.postId, data.text, data.author]
          );
        }
      } catch (err) {
        console.error('DB insert error:', err);
      }
    },
  });
};

module.exports = { run, consumer };