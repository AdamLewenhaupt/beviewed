getTime = ->
	d = new Date()
	"#{d.getHours()}:#{d.getMinutes()}"

communityNavCtrl = ($scope, $element) ->

	$scope.current = 'social'
	$scope.inputSize = 1
	$scope.chatlog = [
		{ user: "Me", content: "Hello world", time: "16:25" },
		{ user: "Tomten", content: "No", time: "16:40" }
		]

	$(".chat form textarea").on 'keypress', (e) ->
		if e.keyCode == 13
			$(this).parent().submit()
			return false

	$scope.sendMessage = () ->
		$scope.chatlog.push 
			user: "Me"
			content: $scope.messageText
			time: getTime()
		$scope.messageText = ""

	$scope.active = (name) ->
		if $scope.current == name then "active" else ""

	$scope.set = (name) ->
		console.log  $element.children("ul li")
		console.log name