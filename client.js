$(document).ready(function() {
	$.getScript('http://vm:8000/socket.io/socket.io.js', function() {
		var socket = io.connect('http://vm:8000');

		var from = $('#from');
		var to = $('#to');
		var message = $('#message');
		var history = $('#messages');
		var send = $('#send');


		socket.emit('join', from.val());
		socket.on('joined', function(joined) {
			if(joined == "true") {
				send.attr('disabled', false);
			}
		});

		socket.on('message', function(message) {
			history.append("<br>" + message.message);
		});

		send.click(function() {
			if(message.val() != '') {
				socket.emit('message', {from: from.val(), to: to.val(), message: message.val()});
				message.val('');
				message.focus();
			}
		});

	});
});