flow = require "./flow"

services =
	"feed": require "./feed"
	"chat": require "./chat"

flow.io.sockets.on "connection", (socket) ->

	socket.on "init", (data) ->
		for type in data.types
			services[type](socket, data.data)