var http = require('http');
var IM = http.createServer(handler);
IM.listen(8000);

var socket = require('socket.io');
var io = socket.listen(IM);



var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('messages', server, {safe: false});



function handler(request, resource) {
	var response = '';
	resource.writeHead(200, {'Content-Type': 'text/html'});
	resource.end(response);
}


var clients = {};

db.open(function(err, db) {
	if(!err) {
		io.sockets.on('connection', function(socket) {

			socket.on('join', function(room) {
				socket.join(room);
				io.sockets.in(room).emit("joined", "true");
			});

			socket.on('message', function(message) {
				var timestamp = new Date();
				var sender = message.from;
				var recipient = message.to;
				io.sockets.in(sender).emit("message", message);
				io.sockets.in(recipient).emit("message", message);

				db.collection('messages', function(err, collection) {
					message.timestamp = timestamp.getTime();
					collection.insert(message);
				});
			});
		});
	}
});
