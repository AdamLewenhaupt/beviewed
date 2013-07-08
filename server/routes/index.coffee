index =
	get: (req, res) ->
		res.render "index.html"

profile =
	get: (req, res) ->
		res.render "profile.html"

exports.index = index
exports.profile = profile