flow = require "../services"
authorize = require('./users').authorize
colls = null

exports.fetch = (inColls) ->
	colls = inColls

exports.get = (req, res) ->
	authorize req, (err, user) ->
		if err
			res.redirect "/"
		else
			res.render "write.html",
				communities: user.admin
				user: user

exports.newFeed = (req, res) ->
	colls.communities.get req.params.id, (err, community) ->
		if err
			res.send 500, "404-community"
		else
			data = req.body.fields
			data.community = req.params.id

			if community.type == "creative"
				colls.creatorFeeds.post data, (err) ->
					if err
						res.send 500, "500-feed"
					else
						flow.io.sockets.in("community/#{req.params.id}").emit "community/update", {}
						res.send "success"
			else
				res.send 500, "404-type"