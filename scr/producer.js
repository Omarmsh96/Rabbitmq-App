// step 1 : connect to rabittmq server 
// step 2 : create new channel on that connection 
// step 3 : create the exchange (logger exchange )
// step   4:  publish the message to the exchange with routing key 


const amqp = require('amqplib');
const config = require('./config');


class Producer {
    channel ; // check if that channel is exist 

    async createChannel() { 
        const connection = await amqp.connect(config.rabbitMQ.url )  //connecting to the server 
        this.channel= await connection.createChannel()                     //from that connection creating a channel 
    }

    async publishMessage(routingkey, message){
        if(!this.channel){
           await this.createChannel()
        }
        const exchangeName= config.rabbitMQ.exchangeName
        await this.channel.assertExchange(exchangeName, 'direct')
        
        const logDetails = {
            logType: routingkey,
            message: message, 
            dateTime : new Date()
        }
        await this.channel.publish(
            exchangeName,
            routingkey,
            Buffer.from(JSON.stringify({ logDetails })) //the message content is converted to a Buffer using
          );  //send object as string (log details) 
        
        console.log(`the message ${message} is sent the the exchange ${exchangeName} `)
   
    }

}

module.exports = Producer;


//exchange is a messaging entity responsible for routing messages to the appropriate queues
//When a message is published, it is sent to an exchange,
// and the exchange determines how the message should be routed to the queues.
//The routing key is used to determine the destination queues