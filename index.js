const express = require('express');
const bodyParser =require('body-parser')
const Producer =require('./scr/producer')
const producer = new Producer();


const app = express();
app.use(bodyParser.json('application/json')) // because we gonna recive requestes as json data

app.post('/publish', async (req, res) => {
    
    await producer.publishMessage(req.body.logType , req.body.message);  // Extract the message and routing key  from the request body   
    res.send()
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});