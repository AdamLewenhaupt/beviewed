exports.users = require("./users")

authorize = exports.users.authorize

exports.index =
	get: (req, res) ->
		authorize req, (err, user) ->
			if err
				res.render "index.html",
					user:{id:''}			
			else
				res.render "dashboard.html",
					user: user

exports.community = require('./community')

exports.explore =
	get: (req, res) ->
		authorize req, (err, user) ->
			if err
				res.redirect "/"
			else
				res.render "explore.html",
					user: user

exports.dashboard = require("./dashboard")

exports["create-community"] =
	get: (req, res) ->
		authorize req, (err, user) ->
			if err
				res.redirect "/"
			else
				res.render "create-community.html",
					user: user

exports.write = require("./write")

exports.feed = require("./feed")

exports.fetch = (colls) ->
	exports.dashboard.fetch colls
	exports.write.fetch colls
	exports.feed.fetch colls
	exports.users.fetch colls
	exports.community.fetchCommunities colls.communities
	exports.community.fetchUsers colls.users