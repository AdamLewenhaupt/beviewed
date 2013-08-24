dashboardCtrl = ($scope, $http) ->

	$scope.limit = limit

	$scope.$watch 'user', () ->
		$scope.userData = $.parseJSON $scope.user
		communities = $scope.userData.in.concat $scope.userData.admin

		req = $http
			method: "GET"
			url: "/api/feed/multi/0/20?communities=#{communities.join ' '}"

		req.success (data) ->
			$scope.feed = data

		req.error (data) ->
			console.log "Err", data