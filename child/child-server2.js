

process.on('message', function (msg, connection) {
  console.log('Child received: ' + connection + ' machine: ' + msg.port)
  var _connection = connection
  var _machine = 8124 + msg.port

  var http = require('http'),
  io = require('socket.io');

  var server = http.createServer(function(request, response) { });
  server.listen(_machine);

  var socket = io.listen(server, { log: true })
  socket.configure(function () {
    socket.set('heartbeat timeout', 180)
  })

  socket.on('connection', function(client) {
    console.log('Client connection: ' + client)

    // data from glacier, send to client
    if (_connection)
     _connection.on('data', function (m) {
      client.send(m)
     })

    // data from client, send to glacier
    client.on('message', function(data) {
      if (data == 'QUIT\n' || data == 'QUIT' || data == 'quit' || data == 'quit\n') {
       process.send('end', _connection)
      } else {
       if(_connection)
        _connection.write(data + '\n')
      }
    })

    // client disconnected
    client.on('disconnect', function () {
      process.send('end', _connection)

      socket.destroy()
      server.close()

      process.exit()
    })
  })

  socket.on('error', function (err) {
   console.log('socket error on child!')
  })


  process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.log(err.stack);

    socket.destroy();
    server.close();
    process.exit(1);
  })

  process.on('SIGTERM', function () {
    console.log('SIGTERM signal')

    server.close()
    process.exit()
  })

})
