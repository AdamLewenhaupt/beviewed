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

	validators =
		title: () ->
			$scope.fields.title.length >= 8 && $scope.fields.title.length <= 26

		mediaData: () ->
			if $scope.fields.media == "none"
				false
			else
				validators[$scope.fields.media]()

		sc: () ->
			$scope.fields.mediaData.match(regex.extractors.sc)

		yt: () ->
			$scope.fields.mediaData.match(regex.extractors.yt)

		da: () ->
			$scope.fields.mediaData.match(/\d+/) && $scope.fields.mediaData.length > 0

		text: () ->
			$scope.fields.text.length > 0 && $scope.fields.text.length <= 160

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
			when "da" then $scope.fields.mediaData

		$scope.soundCloud = $sce.trustAsResourceUrl $scope.extracted
		$scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{$scope.extracted}"
		$scope.deviantArt = $sce.trustAsHtml("<embed class='embed' ng-switch-when='da' src='http://backend.deviantart.com/embed/view.swf?1' type='application/x-shockwave-flash' width='450' height='589' flashvars='id=#{$scope.extracted}' allowscriptaccess='always'></embed>")

	$scope.mediaType = (name) ->
		$scope.fields.media == name