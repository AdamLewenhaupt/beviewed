colls = null

exports.fetch = (inColls) ->
	colls = inColls

exports.profile =
	get: (req, res) ->
		colls.users.get req.params.id, (err, user) ->
			if err
				res.send 500, err
			else
				res.render "profile.html", 
					user: user