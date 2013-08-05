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

communityCtrl = ($scope) ->

	sendMessage = () ->
		$scope.chatlog.push 
			user: "Me"
			content: $scope.messageText
			time: getTime()
		$scope.messageText = ""
		$(".chat-window-wrapper").animate
			scrollTop: $(".chat-window").height(),
			duration: 50
			queue: false

	$scope.community =
		name: "Aventry fan club"

	$scope.hosts = [
			image: "/img/dummy.jpg"
			tag: "spinnster"
			email: "adam.lewenhauptt@gmail.com"
			country: "sweden"
			firstName: "adam"
			lastName: "lewenhaupt"
			communities: [{ name: "Aventry fan club", image: "/img/dummy2.jpeg"}]
		]

	$scope.current = 'what-up'
	$scope.inputSize = 1
	$scope.chatlog = [
		{ user: "Me", content: "Hello world", time: "16:25" },
		{ user: "Tomten", content: "No", time: "16:40" }
		]

	$(".chat form textarea").on 'keypress', (e) ->
		if e.keyCode == 13
			$scope.$apply ->
				sendMessage()
			return false

	$scope.active = (name) ->
		if $scope.current == name then "active" else ""

	$scope.set = (name) ->
		console.log $element.children("ul li")
		console.log name