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