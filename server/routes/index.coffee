exports.index =
	get: (req, res) ->
		res.render "index.html"

exports.profile =
	get: (req, res) ->
		res.render "profile.html"

exports.community = 
	get: (req, res) ->
		res.render "community.html"

exports.explore =
	get: (req, res) ->
		res.render "explore.html"