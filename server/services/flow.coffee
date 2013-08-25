socket = require('socket.io')

exports.init = (server) ->
	exports.io = socket.listen server, 
		log: false
