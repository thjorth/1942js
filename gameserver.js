var http = require('http'),
  io = require('socket.io'),
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h1>game server </h1>');
    res.end();
  });

server.listen(8080);
var io = io.listen(server), buffer = [];

io.on('connection', function (client) {
  client.on('message', function (message) {
    var msg = { message: [client.sessionId, message] };
    client.broadcast(msg);
  });
});

