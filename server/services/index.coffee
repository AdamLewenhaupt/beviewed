flow = require "./flow"
exports.io = flow.io
exports.init = (server) ->
	flow.init server
	router = require "./service-router"
