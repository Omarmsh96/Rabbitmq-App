const amqp = require('amqplib');
const config = require('./config');

class Producer {
  channel;

  async createChannel() {
    const connection = await amqp.connect(config.rabbitMQ.url);
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = 'logExchange';
    await this.channel.assertExchange(exchangeName, 'direct');

    const logDetails = {
      logType: routingKey,
      message: message,
      dateTime: new Date(),
    };

    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify({ logDetails }))
    );

    console.log(`the routing key ${routingKey} is The message "${message}" is sent to the exchange "${exchangeName}".`);
  }
}

module.exports = Producer;