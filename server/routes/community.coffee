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