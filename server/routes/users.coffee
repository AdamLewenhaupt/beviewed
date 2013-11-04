colls = null

Hasher = require('phpass').PasswordHash
hash = new Hasher

valid = (pass, user) ->
	hash.checkPassword pass, user.pass

createHash = (pass) ->
	hash.hashPassword pass

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

exports.authentication =
	login: (req, res) ->
		email = req.query.email
		pass = req.query.pass
		colls.users.model.find()
			.where("email", email)
			.exec (err, user) ->
				if err || !user[0]
					res.send
						isValid: false
						error: "Please check your credientials, no user with that email was found."
				else
					res.send
						isValid: valid pass, user[0]
						id: user[0]["_id"]

	verifyToken: (req, res) ->
	signup: (req, res) ->