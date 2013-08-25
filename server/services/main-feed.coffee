module.exports = (socket, data) ->

	for community in data.communities
		socket.join "communities/#{community}"