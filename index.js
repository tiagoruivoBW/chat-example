var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var pg = require('pg');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/account/:id', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) { 
    client.query('SELECT * FROM salesforce.Account WHERE Id = ($1)', [request.params.id], function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/account', {results: result.rows} ); }
    });
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
