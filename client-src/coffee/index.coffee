indexCtrl = ($scope, $http) ->

	$scope.loginWidth = 46
	$scope.signupWidth = 50
	$scope.focus = false

	getLogin = () ->
		console.log $scope.loginFields
		$http
			method: "GET"
			url: "/login"
			params:
				email: $scope.loginFields.email
				pass: $scope.loginFields.pass
		.success (res) ->
				if res.isValid
					$scope.user = res.id
				else
					$scope.error (res.error || "Something went wrong when loging in, please check your credientals")

	$scope.focusLogin = () ->
		$scope.loginWidth = 76
		$scope.signupWidth = 20
		$scope.focus = "login"

	$scope.focusSignup = () ->
		$scope.loginWidth = 20
		$scope.signupWidth = 76
		$scope.focus = "signup"

	$scope.error = () -> console.log "err"

	$scope.login = () ->
		if $scope.$$phase
			console.log "phase"
			getLogin()
		else
			$scope.$apply () ->
				getLogin()


	$scope.signup = () ->
		$http
			method: "POST"
			url: "/signup"
			data: $scope.fields.signup
		.success (res) ->
			if res.success
				$scope.user = res.id
			else
				$scope.error (res.error || "Something went terribly terribly wrong, please try again!")