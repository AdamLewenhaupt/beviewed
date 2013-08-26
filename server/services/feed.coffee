module.exports = (socket, data) ->

	data.communities.forEach (community) ->
		socket.join "community/#{community}"