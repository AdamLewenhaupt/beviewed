getTime = ->
	d = new Date()
	"#{d.getHours()}:#{d.getMinutes()}"


exploreCtrl = ($scope, $http) ->

	$scope.searchType = "makers"

	$scope.swipeRight = () ->
		console.log "swipe"
		$(".side-nav").addClass("side-nav-hover")

	$scope.swipeLeft = () ->
		$(".side-nav").removeClass("side-nav-hover")

	$scope.currentType = (name) ->
		"btn-success" if name == $scope.searchType

	$scope.communities = []

	req = $http
		method: "GET"
		url: "/community-explore/init"

	req.success (data) ->
		$scope.communities = data

	req.error (err) ->
		console.log err

	$scope.tags = [
			"music",
			"games",
			"art",
			"comedy"
		]

	$scope.selectedTags = []

	$scope.displayTag = (tag) ->
		!(tag in $scope.selectedTags) and tag.indexOf($scope.tagSearch.toLowerCase()) != -1

	$scope.displayCommunity = (community) ->
		check1 = community.name.toLowerCase().indexOf($scope.mainQuery.toLowerCase()) != -1
		check2 = true
		if $scope.selectedTags.length > 0
			for tag in $scope.selectedTags
				unless (tag in community.tags)
					check2 = false
					break

		check1 && check2

profileCtrl = ($scope, $http) ->

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