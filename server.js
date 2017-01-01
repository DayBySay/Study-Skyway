var express = require('express')
  , http = require('http')
  , app = express();
app.use(express.static(__dirname));
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port);

var socketio = require('socket.io');
var io = socketio.listen(server);

var usersHash = {};

io.sockets.on('connection', function(socket) {
    socket.on("connected", function (userid) {
		usersHash[socket.id] = userid;

        io.sockets.emit("reload_users", getUsers());
    });

    socket.on("disconnect", function(data) {
		delete usersHash[socket.id];

        io.sockets.emit("reload_users", getUsers());
    });
});

function getUsers() {
	var users = [];
	for(key in usersHash){
		users.push(usersHash[key]);
	}
	return users;
}
