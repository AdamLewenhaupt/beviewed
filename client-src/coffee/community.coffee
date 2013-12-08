communityCtrl = ($scope, $http, $sce, flow, stream, $window) ->

	stream.change $scope, "loadState"

	$scope.isLoading = () ->
		$scope.loadState > 0

	$scope.chats = {}
	$scope.newName = ""
	$scope.feed = []
	$scope.mainFeed =
		media: "none"

	$scope.capitalize = capitalize

	$scope.current = 'what-up'
	$scope.inputSize = 1

	$scope.error = (msg) ->
		console.log msg

	$scope.join = () ->
		req = $http
			method: "POST"
			url: "/join/#{$scope.community['_id']}"

		req.success (res) ->
			if res.error
				$scope.error "Unable to join community"
			else if res.joined
				$scope.memberType = "member"


	$scope.renameCommunity = () ->
		if $scope.newName && $scope.newName.length > 8
			req = $http
				method: "PUT"
				url: "/community/#{$scope.community['_id']}"
				data: 
					name: $scope.newName

			req.error () ->
				$scope.error "Unable to update community name, please try again later."
			req.success () ->
				$scope.community.name = $scope.newName.toLowerCase()


	$scope.isMember = () ->
		unless $scope.memberType
			return false
		else if $scope.memberType == "admin" || $scope.memberType == "member"
			return true
		else
			return false

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
			data = $.parseJSON $scope.communityData
			$scope.community = data.community
			$scope.user = data.user

			document.title = $scope.capitalize($scope.community.name)

			id = $scope.community['_id']

			$scope.memberType = switch
				when id in $scope.user.in
					"member"
				when id in $scope.user.admin
					"admin"
				else
					"visitor"
			
			flow.init ["chat"],
				rooms: $scope.community.roomDatas

			$scope.removeRoomOptions = {}

			for room, i in $scope.community.rooms
				$scope.removeRoomOptions[room] = i


			$scope.community.roomDatas.forEach (room) ->
				$scope.chats[room] = []
				flow.on "chat/update/#{room}", (entity) ->
					$scope.$apply () ->
						$scope.chats[room].push entity

						$(".chat-window-wrapper").animate
							scrollTop: $(".chat-window").height(),
							duration: 50
							queue: false

			$scope.newName = $scope.community.name

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

	$scope.addRoom = (name) ->
		console.log name

	$scope.removeRoom = (index) ->
		console.log index