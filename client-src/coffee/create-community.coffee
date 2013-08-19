createCommunity = ($scope, $http) ->

	uploading = false
	$scope.maxStep = 1
	$scope.capitalize = capitalize
	$scope.warnings = []

	max = (nr) ->
		if nr > $scope.maxStep
			$scope.maxStep = nr

	# Jquery setup
	$ () ->
		$("#img-upload").change () ->
			$scope.$apply () ->
				uploading = true

	$scope.runUpload = () ->
		$scope.icon = {}
		uploading = false
		$("#img-upload").trigger('click')

	$scope.isUploading = () ->
		if uploading
			""
		else
			"hide"

	$scope.isUploadingInverse = () ->
		if uploading
			"hide"
		else
			""
 
	$scope.tags = [
			"music",
			"games",
			"art",
			"comedy"
		]

	$scope.warn = (msg) ->
		$scope.warnings.push msg

	$scope.go = (number) ->
		$scope.step = number

	$scope.current = (num) ->
		if num == $scope.step
			"btn-primary"
		else
			"btn-info"

	$scope.displayTag = (tag) ->
		!(tag in $scope.fields.tags) and tag.indexOf($scope.tagSearch) != -1

	$scope.validName = () ->
		if $scope.fields.name.length < 8
			"has-error"
		else
			"has-success"

	$scope.validDescription = () ->
		if $scope.fields.description.length > 0 && $scope.fields.description.length <= 160
			""
		else
			"has-error"
 
	$scope.stepOne = (type) ->
		$scope.fields.type = type
		if $scope.validName() == "has-success"
			$scope.step = 2
			max(2)
		else
			$scope.warn "Hold your horeses! That name is to short"

	$scope.stepTwo = (dataUrl) ->
		if dataUrl
			$scope.fields.icon = dataUrl
			$scope.step = 3
			max(3)

	$scope.create = () ->
		$scope.fields.admins = ['spinno']
		$scope.fields.userCount = 0
		request = $http
			method: "POST"
			url: "/create-community"
			data: $scope.fields

		request.sucess (data) ->
			alert("Success")

		request.error (data) ->
			alert("Error :(")