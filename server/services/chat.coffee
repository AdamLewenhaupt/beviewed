module.exports = (socket, data) ->

	data.rooms.forEach (room) ->

		socket.join "rooms/#{room}"

		socket.on "chat/#{room}", (data) ->
			socket.broadcast.to("rooms/#{room}")
				.emit "chat/update/#{room}", data