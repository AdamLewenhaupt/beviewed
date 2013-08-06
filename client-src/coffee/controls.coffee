getTime = ->
	d = new Date()
	"#{d.getHours()}:#{d.getMinutes()}"


exploreCtrl = ($scope) ->

	$scope.communities = [{ name: "aventry fan club", image: "/img/dummy2.jpeg", tags: ["music"]}]

	$scope.tags = [
			"music",
			"games",
			"art",
			"comedy"
		]

	$scope.selectedTags = []

	$scope.displayTag = (tag) ->
		!(tag in $scope.selectedTags) and tag.indexOf($scope.tagSearch) != -1

	$scope.displayCommunity = (community) ->
		check1 = community.name.indexOf($scope.mainQuery) != -1
		check2 = false
		if $scope.selectedTags.length > 0
			for tag in community.tags
				if tag in $scope.selectedTags
					check2 = true
					break
		else
			check2 = true

		check1 && check2

profileCtrl = ($scope) ->
	$scope.user =
		image: "/img/dummy.jpg"
		tag: "spinnster"
		email: "adam.lewenhauptt@gmail.com"
		country: "sweden"
		firstName: "adam"
		lastName: "lewenhaupt"
		communities: [{ name: "Aventry fan club", image: "/img/dummy2.jpeg"}]

	$scope.admin = true