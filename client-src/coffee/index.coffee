indexCtrl = ($scope, $dialog, $http) ->

	$scope.loginWidth = 46
	$scope.signupWidth = 50
	$scope.focus = false

	$scope.focusLogin = () ->
		$scope.loginWidth = 76
		$scope.signupWidth = 20
		$scope.focus = "login"

	$scope.focusSignup = () ->
		$scope.loginWidth = 20
		$scope.signupWidth = 76
		$scope.focus = "signup"

	$scope.login = () ->
		$http
			method: "GET"
			url: "/authorize"
			params:
				user: $scope.login.email
				pass: $scope.login.pass
		.success (res) ->
				if res.isValid
					$scope.$apply () ->
						$scope.user = res.id
				else
					$scope.$apply () ->
						$scope.error (res.error || "Something went wrong when loging in, please check your credientals")


	$scope.signup = () ->
		$http
			method: "POST"
			url: "/signup"
			data: $scope.signup
		.success (res) ->
			if res.success
				$scope.$apply () ->
					$scope.user = res.id
			else
				$scope.$apply () ->
					$scope.error (res.error || "Something went terribly terribly wrong, please try again!")