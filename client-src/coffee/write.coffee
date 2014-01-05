writeCtrl = ($scope, $http, $sce) ->

	$scope.fields =
		title: ""
		media: "none"
		mediaData: ""
		text: ""

	regex =
		extractors:
			sc: /(.*)src\=\"([^\"]+)(.*)/gi
			yt: /(.+)\/watch\?v=(.+)/gi

	$scope.warnings = []

	warn = (msg, type, href) -> $scope.warnings.push 
		msg: msg
		type: type || ""
		href: href

	validators =
		title: () ->
			$scope.fields.title.length >= 4 && $scope.fields.title.length <= 40

		mediaData: () ->
			if $scope.fields.media == "none"
				false
			else
				validators[$scope.fields.media]()

		sc: () ->
			$scope.fields.mediaData.match(regex.extractors.sc)

		yt: () ->
			$scope.fields.mediaData.match(regex.extractors.yt)

		text: () ->
			$scope.fields.text.length > 0 && $scope.fields.text.length <= 320

	$scope.validate = (name) ->
		if validators[name]()
			"has-success"
		else
			"has-info"

	$scope.validateIcon = (name) ->
		if validators[name]()
			"glyphicon glyphicon-ok"
		else
			"glyphicon glyphicon-remove"

	$scope.ready = () ->

		if validators["title"]() && validators["mediaData"]() && validators["text"]()
			"btn-success"
		else
			"btn-primary"

	$scope.save = () ->
		$scope.warnings = []
		count = 0
		if validators["title"]()
			count += 1
		else
			warn "Looks like there is something wrong with your title"

		if validators["mediaData"]() 
			count += 1
		else
			warn "Woopsie daisy! Please recheck the media field"

		if validators["text"]()
			count += 1
		else
			warn "Don't try to trick us! Recheck your description please"

		if count == 3
			req = $http
				method: "POST"
				url: "/new-feed/#{$scope.community}"
				data:
					fields:
						title: $scope.fields.title
						media: $scope.fields.media
						text: $scope.fields.text
						mediaData: $scope.extracted

			req.success (data) ->
				warn "Successfully posted, Click me to go to your community", "alert-success", "/community/#{$scope.community}"

			req.error (data) ->
				if data == "404-type"
					warn "Your community is not of the type that you are submiting a feed for"
				else
					warn "Oh no! Looks like there was a problem, please check your internet connection"

	$scope.capitalize = capitalize

	$ () ->
		$scope.$apply () ->
			$scope.available = $.parseJSON $(".data").html()

			if $scope.available.length == 1
				$scope.setCommunity($scope.available[0])


	$scope.setCommunity = (community) ->
		$scope.community = community

		req = $http
			url: "/api/community/#{community}"
			method: "GET"

		req.success (data) ->
			$scope.communityData = data

		req.error (err) ->
			$scope.error = err

	$scope.isCreator = () ->
		($scope.communityData || {}).type == "creative"

	$scope.media = (name) ->
		$scope.extracted = ""
		$scope.fields.mediaData = ""
		$scope.fields.media = name

	$scope.extract = () ->
		$scope.extracted = switch $scope.fields.media 
			when "sc" then $scope.fields.mediaData.replace(regex.extractors.sc, "$2")
			when "yt" then $scope.fields.mediaData.replace(regex.extractors.yt, "$2")

		$scope.soundCloud = $sce.trustAsResourceUrl $scope.extracted
		$scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{$scope.extracted}"

	$scope.mediaType = (name) ->
		$scope.fields.media == name