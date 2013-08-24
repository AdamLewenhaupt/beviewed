exports.index =
	get: (req, res) ->
		res.render "index.html"

exports.users = require("./users")

exports.community = require('./community')

exports.explore =
	get: (req, res) ->
		res.render "explore.html"

exports.dashboard = require("./dashboard")

exports["create-community"] =
	get: (req, res) ->
		res.render "create-community.html"

exports.write = require("./write")

exports.feed = require("./feed")

exports.fetch = (colls) ->
	exports.dashboard.fetch colls
	exports.write.fetch colls
	exports.feed.fetch colls
	exports.users.fetch colls
	exports.community.fetchCommunities colls.communities