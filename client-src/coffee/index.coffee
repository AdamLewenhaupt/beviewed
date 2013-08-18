indexCtrl = ($scope, $dialog) ->

	$scope.loginDialog = 
		open: () -> $scope.login = true
		close: () -> $scope.login = false