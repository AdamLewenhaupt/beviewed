exports.index =
	get: (req, res) ->
		res.render "index.html"

exports.users = require("./users")

exports.community = require('./community')

exports.explore =
	get: (req, res) ->
		res.render "explore.html"

exports.dashboard = 
	get: (req, res) ->
		res.render "dashboard.html"

exports["create-community"] =
	get: (req, res) ->
		res.render "create-community.html"