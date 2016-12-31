navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
 
var localStream;    // 自分の映像ストリームを保存しておく変数
var connectedCall;  // 接続したコールを保存しておく変数
 
var peer = new Peer({ key: 'f42387e2-4c9f-4951-bce2-cc7802643eba', debug: 3});
 
peer.on('open', function(){
    $('#my-id').text(peer.id);
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
