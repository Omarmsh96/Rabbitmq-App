// step 1 : connect to rabittmq server 
// step 2 : create new channel on that connection 
// step 3 : create the exchange 
// step 4 : create Queue
// step 5 : bind the queue to the exchange
// step 6 : consume message from the queue

const amqp = require('amqplib');

const consumeMessage = async () => {
    // Perform asynchronous operations here
    // You can use the 'await' keyword to wait for promises to resolve
    
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel();
    await channel.assertExchange('logExchange', 'direct ')

    const que = await channel.assertQueue('infoQueue')  // create queue

    await channel.bindQueue(que.queue, 'logExchange', "info")  // routing key should equal to binding key in the request body (info is binging key ) 
    await channel.bindQueue(que.queue, 'logExchange', "Error ")
    channel.consume(que.queue, (msg)=> {
      
      const data = JSON.parse(msg.content) //the acual content that we are sending as message 
      console.log(data)
      channel.ack(msg)  // notify that msg was consumed successfuly 
    } )

    
  };

  consumeMessage()