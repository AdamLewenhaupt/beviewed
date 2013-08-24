colls = undefined

exports.fetch = (collections) ->
	colls = collections

exports.get = (req, res) ->
	colls.users.get req.params.id, (err, user) ->
		if err
			res.send 500, err
		else
			res.render "dashboard.html",
				user: user