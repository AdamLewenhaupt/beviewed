communityCtrl = ($scope, $http, $sce) ->

	$scope.feed = []
	$scope.mainFeed =
		media: "none"

	$scope.feedFilter = (novelty) ->
		$scope.mainFeed["_id"] != novelty["_id"]

	$scope.setMainFeed = (n) ->
		$scope.mainFeed = $scope.feed[n]

		if $scope.mainFeed.media == "sc"
			$scope.soundCloud = $sce.trustAsResourceUrl $scope.mainFeed.mediaData
		else if $scope.mainFeed.media == "yt"
			$scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{$scope.mainFeed.mediaData}"

	$ () ->
		$scope.$apply () ->
			$scope.community = $.parseJSON $(".community-data").html()
			$scope.activeRoom = $scope.community.rooms[0]
			req = $http
				method: "GET"
				url: "/api/feed/#{$scope.community['_id']}/#{$scope.community.type}/0/10"

			req.success (data) ->
				$scope.feed = data
				if $scope.feed.length > 0
					$scope.setMainFeed(0)

			req.error (data) ->
				console.log data


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

	$scope.capitalize = capitalize

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

	$scope.isCurrentRoom = (room) ->
		if $scope.activeRoom == room
			"active"
		else
			""

	$scope.setRoom = (room) -> $scope.activeRoom = room