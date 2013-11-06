colls = null

Hasher = require('phpass').PasswordHash
hash = new Hasher

valid = (pass, user) ->
	hash.checkPassword pass, user.pass

createHash = (pass) ->
	hash.hashPassword pass


createSession = (user, fn) ->
	date = new Date().getTime()
	colls.sessions.post 
		target: user["_id"]
		expire: date+36e5, (err, session) -> fn(err, session['_id'])

exports.fetch = (inColls) ->
	colls = inColls


exports.authorize = (req, fn) ->
	sid = req.signedCookies['s_id']
	if sid
		colls.sessions.get sid, (err, sess) ->
			if err
				fn(err, null)
			else if !sess
				fn("no-sess", null)
			else
				colls.users.get sess.target, (err, user) ->
					if err
						fn(err, null)
					else
						fn(null, user)
	else
		fn("no sid", null)

exports.profile =
	get: (req, res) ->
		colls.users.get req.params.id, (err, user) ->
			if err
				res.send 500, err
			else
				res.render "profile.html", 
					user: user

exports.expire = () ->
	time = new Date().getTime()
	colls.sessions.model.find()
		.where("expire").gte(time)
		.remove()

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
					unless valid pass, user[0]
						res.send 
							isValid: false
							error: "Invalid password / email combination."
					else
						createSession user[0], (err, sess) ->
							if err
								res.send
									isValid: false
									error: "There was an error when trying to generate your login session."
							else
								res.cookie "s_id", sess, { signed: true }
								res.send
									isValid: true

	signup: (req, res) ->
		email = req.body.email
		pass = req.body.pass1 if req.body.pass1 == req.body.pass2
		unless pass
			res.send
				error: "pass-err"
		else
			colls.users.model.find()
				.where("email", email)
				.exec (err, users) ->
					if err
						res.send
							error: "usr-err"
						return
					if users.length > 0
						res.send
							error: "usr-exists"
						return

					colls.users.post
						email: email
						pass: (createHash pass), (err, user) ->
							if err
								res.send
									error: "post-err"
							else
								createSession user, (err, sess) ->
									console.log "stage 3"
									if err
										res.send
											error: "sess-err"
									else
										res.cookie "s_id", sess, { signed: true }
										res.send "reg"