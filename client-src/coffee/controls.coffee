getTime = ->
	d = new Date()
	"#{d.getHours()}:#{d.getMinutes()}"


exploreCtrl = ($scope, $http) ->

	$scope.searchType = "makers"

	$scope.swipeRight = () ->
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
		check1 = community.name.indexOf($scope.mainQuery.toLowerCase()) != -1
		check2 = true
		if $scope.selectedTags.length > 0
			for tag in $scope.selectedTags
				unless (tag in community.tags)
					check2 = false
					break

		check1 && check2

profileCtrl = ($scope) ->
	$scope.cap = capitalize

	$ () ->
		$scope.$apply () ->
			$scope.user = $.parseJSON $(".user-data").html()
