index =
	get: (req, res) ->
		res.render "index.html"

profile =
	get: (req, res) ->
		res.render "profile.html"

community = 
	get: (req, res) ->
		res.render "community.html"

exports.index = index
exports.profile = profile
exports.community = community