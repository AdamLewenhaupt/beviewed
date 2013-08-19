writeCtrl = ($scope, $http) ->

	regex =
		extractors:
			sc: /(.*)src\=\"([^\"]+)(.*)/gi
			yt: /(.+)\/watch\?v=(.+)/gi
	$scope.capitalize = capitalize

	$scope.fields = {}

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
		$scope.fields.media = name

	$scope.extract = () ->
		$scope.extracted = switch $scope.fields.media 
			when "sc" then $scope.fields.mediaData.replace(regex.extractors.sc, "$2")
			when "yt" then $scope.fields.mediaData.replace(regex.extractors.yt, "$2")

	$scope.mediaType = (name) ->
		$scope.fields.media == name