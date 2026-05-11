const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'api-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
});
const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  return producer;
};

const sendData = async (type, data) => {
  await producer.send({
    topic: 'social-data',
    messages: [{ value: JSON.stringify({ type, ...data }) }],
  });
};

module.exports = { connectProducer, sendData };