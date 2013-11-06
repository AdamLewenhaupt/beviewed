exports.users = require("./users")

authorize = exports.users.authorize

exports.index =
	get: (req, res) ->
		authorize req, (err, user) ->
			if err
				res.render "index.html"
			else
				res.render "dashboard.html",
					user: user

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