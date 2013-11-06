authorize = require('./users').authorize

colls = undefined

exports.fetch = (collections) ->
	colls = collections

exports.get = (req, res) ->
	authorize req, (err, user) ->
		if err
			res.redirect "/"
		else
			res.render "dashboard.html",
				user: user