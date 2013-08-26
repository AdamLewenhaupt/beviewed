flow = require "./flow"

exports.init = (server) ->
	flow.init server
	exports.io = flow.io
	router = require "./service-router"
