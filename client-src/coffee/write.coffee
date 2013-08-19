writeCtrl = ($scope) ->

	$ () ->
		$scope.$apply () ->
			$scope.available = $.parseJSON $(".data").html()

			# if $scope.available.length == 1
			# 	$scope.community = $scope.available[0]


	$scope.setCommunity = (community) ->
		$scope.community = community