profileCtrl = ($scope, $http) ->

	$scope.countries = window.countries

	$scope.setCountry = (code) ->
		if $scope.countries[code] != undefined
			req = $http 
				method: "PUT"
				url: "/profile"
				data:
					country: code

			req.success () ->
				$scope.user.country = code

	$scope.setName = (name) ->
		names = name.split ' '
		data = {}
		data.firstName = names[0]
		if names.length > 1
			data.lastName = names[1]

		console.log  data

		if names.length > 0
			req = $http
				method: "PUT"
				url: "/profile"
				data: data

			req.success () ->
				$scope.user.firstName = data.firstName.toLowerCase()
				if names.length > 1
					$scope.user.lastName = data.lastName.toLowerCase()

	$scope.cap = capitalize

	$scope.signout = () ->
		$http
			method: "POST"
			url: "/signout"
		.success (res) ->
			if res.error
 				console.log res.error
 			else
 				window.location.replace("/")