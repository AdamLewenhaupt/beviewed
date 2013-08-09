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
			fs.writeFile path, req.body.icon, 'binary', (err) ->
				if err
					res.send 500, "img-err"
				else
					res.send 200, "success"