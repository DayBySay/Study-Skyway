navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall;  // 接続したコールを保存しておく変数
 
var peer = new Peer({ key: 'f42387e2-4c9f-4951-bce2-cc7802643eba', debug: 3});
 
peer.on('open', function(){
    $('#my-id').text(peer.id);
	login(peer.id);
});
 
peer.on('call', function(call){
    connectedCall = call;
    $("#peer-id").text(call.peer);

    call.answer(localStream);

    call.on('stream', function(stream){
        var url = URL.createObjectURL(stream);
        $('#peer-video').prop('src', url);
    });
});

var socket = io.connect();

function login(userid) {
	socket.emit("connected", userid);
}

socket.on("reload_users", function(users) {
	console.log("reload users!");
	console.log(users);
	var ul = document.getElementById("users");
	while (ul.firstChild){
		ul.removeChild(ul.firstChild);
	}
		
	users.forEach(function (item, index, array) {
		var p = document.createElement("p");
		var text = document.createTextNode(item);
		p.appendChild(text);
		var li = document.createElement("li");
		li.appendChild(p);
		ul.appendChild(li);
	});
});
 
$(function() {
    navigator.getUserMedia({audio: true, video: true}, function(stream){
        localStream = stream;
        var url = URL.createObjectURL(stream);
 
        $('#my-video').prop('src', url);
 
    }, function() { alert("Error!"); });
 
    $('#call-start').click(function(){
        var peer_id = $('#peer-id-input').val();
        var call = peer.call(peer_id, localStream);
            
        call.on('stream', function(stream){
            $("#peer-id").text(call.peer);
            var url = URL.createObjectURL(stream);
            $('#peer-video').prop('src', url);
        });
    });

    $('#call-end').click(function(){
        // ビデオ通話を終了する
        connectedCall.close();
    });
});
