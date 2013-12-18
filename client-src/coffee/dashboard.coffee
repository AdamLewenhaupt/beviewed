dashboardCtrl = ($scope, $http, flow, stream) ->

	$scope.recent = false

	$scope.loadState = 0

	stream.change $scope, "loadState"

	$scope.isLoading = () ->
		$scope.loadState > 0

	$scope.limit = limit
	$scope.new = 0

	$scope.$watch 'user', () ->
		$scope.userData = $.parseJSON $scope.user
		communities = $scope.userData.in.concat $scope.userData.admin

		flow.init ["feed"], 
			communities: communities

		req = $http
			method: "GET"
			url: "/api/feed/multi/0/20?communities=#{communities.join ' '}"

		req.success (data) ->
			$scope.feed = data

		req.error (data) ->
			console.log "Err", data


		flow.on "community/update", () ->
			$scope.$apply () ->
				$scope.new++;