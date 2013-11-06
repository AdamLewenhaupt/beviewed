indexCtrl = ($scope, $http) ->

	window.toggleLoad = () ->
		$scope.$apply () ->
			$scope.isLoading = !$scope.isLoading

	$scope.loginWidth = 46
	$scope.signupWidth = 50
	$scope.focus = false
	$scope.isLoading = false
	$scope.loginFields = {}
	$scope.signupFields = {}

	getLogin = () ->
		return false unless $scope.loginFields.email && $scope.loginFields.pass
		$scope.isLoading = true
		$http
			method: "GET"
			url: "/login"
			params:
				email: $scope.loginFields.email
				pass: $scope.loginFields.pass
		.success (res) ->
				$scope.isLoading = false
				if res.isValid
					window.location.replace("/")
				else
					$scope.error (res.error || "Something went wrong when loging in, please check your credientals")
		.error (err) ->
			$scope.isLoading = false

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
			getLogin()
		else
			$scope.$apply () -> getLogin()


	getSignup = () ->
		return false unless $scope.signupFields.email && $scope.signupFields.pass1 && $scope.signupFields.pass2
		if $scope.signupFields.pass1 != $scope.signupFields.pass2
			$scope.error (res.error || "Your passwords don't match, please try again!")
			return
		console.log "all good"
		$scope.isLoading = true
		$http
			method: "POST"
			url: "/signup"
			data: $scope.signupFields
		.success (res) ->
			$scope.isLoading = false
			if res.error
				console.log res.error
			else if res == "reg"
				window.location.replace("/")
		.error (err) ->
			$scope.isLoading = false


	$scope.signup = () ->
		if $scope.$$phase
			getSignup()
		else
			$scope.$apply () -> getSignup()