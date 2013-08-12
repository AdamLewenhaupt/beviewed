fs = require 'fs'
communities = null

exports.fetchCommunities = (data) -> communities = data

exports.get = (req, res) ->
	communities.get req.params.id, (err, community) ->
		res.render "community.html", 
			community: community

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
					res.send 200, "success"


exports.min =
	get: (req, res) ->
		communities.get req.params.id, (err, community) ->
			if err
				res.send 500, err
			else
				res.send 200, 
					name: community.name
					users: community.userCount

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