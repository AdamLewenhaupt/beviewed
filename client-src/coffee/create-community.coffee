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

	validators = 
		name: () ->
			$scope.fields.name.length >= 8 && $scope.fields.name.length <= 26

		description: () ->
			$scope.fields.description.length > 0 && $scope.fields.description.length <= 160


	$scope.validate = (name) ->
		if validators[name]()
			"has-success"
		else
			""

	$scope.validateIcon = (name) ->
		if validators[name]()
			"glyphicon glyphicon-ok"
		else
			"glyphicon glyphicon-remove"

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
 
	$scope.stepOne = (type) ->
		$scope.fields.type = type
		if validators["name"]()
			$scope.step = 2
			max(2)
		else
			$scope.warnings = []
			$scope.warn "Hold your horeses! That name is to short"

	$scope.stepTwo = (dataUrl) ->
		$scope.fields.icon = dataUrl || "no-icon"
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