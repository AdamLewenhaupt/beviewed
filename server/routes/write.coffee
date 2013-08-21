colls = null

exports.fetch = (inColls) ->
	colls = inColls

exports.get = (req, res) ->
	colls.users.get req.params.id, (err, user) ->
			if err
				res.send 500, err
			else
				res.render "write.html", 
					communities: user.admin

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
						res.send "success"
			else
				res.send 500, "404-type"
