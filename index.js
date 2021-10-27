var app = require('express')();
var http = require('http').Server(app);
var amqp = require('amqplib/callback_api');

const io = require("socket.io")(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

// Used for serving the HTML page (if used)
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

// Listen for new connections
const socket = io.on('connection', function(socket){
  console.log('a user connected');
  return socket
});

http.listen(3100, function(){
  console.log('listening on *:3100');
});

amqp.connect('amqp://localhost:5672/titan-hud', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'test';

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            socket.emit('test', msg.content.toString());
        }, {
            noAck: true
        });
    });
});