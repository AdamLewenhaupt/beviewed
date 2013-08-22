colls = undefined

exports.fetch = (collections) ->
	colls = collections

exports.api =
	get: (req, res) ->
		community = req.params.community
		type = req.params.type
		from = req.params.from
		to = req.params.to

		if type == "creative"
			colls.creatorFeeds.model.find()
				.where("community", community)
				.sort({ '_id': -1 })
				.skip((from || 0))
				.limit((to))
				.exec (err, feeds) ->
					if err
						res.send 500, err
					else
						res.send feeds
		else
			res.send 500, "nope"