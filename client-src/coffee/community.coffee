communityCtrl = ($scope, $http, $sce, flow) ->

	$scope.chats = {}

	$scope.feed = []
	$scope.mainFeed =
		media: "none"

	$scope.capitalize = capitalize

	$scope.current = 'what-up'
	$scope.inputSize = 1

	$scope.swipeRight = () ->
		$(".side-nav").addClass("side-nav-hover")

	$scope.swipeLeft = () ->
		$(".side-nav").removeClass("side-nav-hover")

	$scope.currentTab = (name) ->
		"btn-success" if name == $scope.current

	$scope.feedFilter = (novelty) ->
		$scope.mainFeed["_id"] != novelty["_id"]

	$scope.setMainFeed = (n) ->
		$scope.mainFeed = $scope.feed[n]

		if $scope.mainFeed.media == "sc"
			$scope.soundCloud = $sce.trustAsResourceUrl $scope.mainFeed.mediaData
		else if $scope.mainFeed.media == "yt"
			$scope.youTube = $sce.trustAsResourceUrl "http://www.youtube.com/embed/#{$scope.mainFeed.mediaData}"

	$scope.$watch "communityData", () ->
			$scope.community = $.parseJSON $scope.communityData
			
			flow.init ["chat"],
				rooms: $scope.community.roomDatas

			$scope.community.roomDatas.forEach (room) ->
				$scope.chats[room] = []
				flow.on "chat/update/#{room}", (entity) ->
					console.log room, entity
					$scope.$apply () ->
						$scope.chats[room].push entity

						$(".chat-window-wrapper").animate
							scrollTop: $(".chat-window").height(),
							duration: 50
							queue: false


			$scope.setRoom 0

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
		flow.emit "chat/#{$scope.activeRoomData}", 
			user: "spinno"
			msg: $scope.messageText
			time: getTime()

		$scope.chats[$scope.activeRoomData].push 
			user: "Me"
			msg: $scope.messageText

		$scope.messageText = ""
		$(".chat-window-wrapper").animate
			scrollTop: $(".chat-window").height(),
			duration: 50
			queue: false

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

	$scope.setRoom = (n) -> 
		$scope.activeRoom = $scope.community.rooms[n]
		$scope.activeRoomData = $scope.community.roomDatas[n]