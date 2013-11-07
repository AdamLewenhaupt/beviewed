fs = require 'fs'
authorize = require('./users').authorize
communities = null
users= null

exports.fetchCommunities = (data) -> communities = data
exports.fetchUsers = (data) -> users = data

exports.get = (req, res) ->
	authorize req, (err, user) ->
		communities.get req.params.id, (err, community) ->
			res.render "community.html", 
				community: community
				user: user || {id:''}

exports.init = (data) ->
	communities.post data, (c) ->
		console.log c

exports.log = () ->
	console.log "Running community logger"
	communities.model.find().exec (err, data) ->
		unless err
			data.forEach (community) ->
				community.userCountLog.push community.userCount
				community.save()
		else
			console.log "Error running community logger"


exports.post = (req, res) ->
	admin = req.body.admins[0]
	req.body.userCount = 1
	if admin
		communities.post req.body, (err, community) ->
			if err
				res.send 500, "save-err"
			else
				path = "./client/img/icons/#{community['_id']}"
				encodedIcon = req.body.icon.replace /^data:image\/png;base64,/, ""
				fs.writeFile path, encodedIcon, 'base64', (err) ->
					if err
						res.send 500, "img-err"
					else
						users.get admin, (err, user) ->
							if err
								res.send 500, "user-err"
							else
								user.admin.push community['_id']
								user.save()
								res.send 
									id: community["_id"]
	else
		res.send 500, "admin-err"


exports.min =
	get: (req, res) ->
		communities.get req.params.id, (err, community) ->
			if err
				res.send 500, err
			else
				res.send 200, 
					name: community.name
					users: community.userCount

exports.api =
	get: (req, res) ->
		communities.get req.params.id, (err, community) ->
			if err
				res.send 500, err
			else
				res.send community

exports.explore =
	get: (req, res) ->
		if req.params.type == "init"
			communities.model.find()
				.select("_id tags name")
				.sort({ userCount: -1 })
				.limit(50)
				.exec (err, communities) ->
					if err
						res.send 500, err
					else
						res.send 200, communities
		else
			res.send 500, "invalid request"