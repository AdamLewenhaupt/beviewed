communityCtrl = ($scope) ->

	$ () ->
		$scope.$apply () ->
			$scope.community = $.parseJSON $(".community-data").html()

			$scope.activeRoom = $scope.community.rooms[0]

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