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

exports.join = (req, res) ->
	exports.authorize req, (err, user) ->
		if err
			res.send
				error: "auth-err"
		else
			colls.communities.get req.params.id, (err, community) ->
				if err
					res.send
						error: "community-err"
				else
					user.in.push community['_id']
					community.users.push user["_id"]
					community.userCount += 1
					user.save()
					community.save()
					res.send 
						joined: true


exports.profile =
	get: (req, res) ->
		exports.authorize req, (err, user) ->
			if err
				res.redirect "/"
			else
				res.render "profile.html", 
					user: user
					write: true

	put: (req, res) ->
		exports.authorize req, (err, user) ->
			if err
				res.send 403
			else
				colls.users.put user['_id'], req.body, (err) ->
					if err
						res.send 500
					else
						res.send 200

exports.pubProfile = 
	get: (req, res) ->
		exports.authorize req, (err, user) ->
			if err
				user =
					id:''

			colls.users.get req.params.id, (err, user) ->
				res.render "profile.html",
					user:user
					write:false

exports.authentication =
	signout: (req, res) ->
		sid = req.signedCookies['s_id']
		unless sid
			res.send 
				error: "sess-err|c"
		else
			colls.sessions.get sid, (err, sess) ->
				if err
					res.send
						error: "sess-err|s"
				else
					sess.remove()
					res.clearCookie "s_id"
					res.send "success"

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
					pass: (createHash req.body.pass), (err, user) ->
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