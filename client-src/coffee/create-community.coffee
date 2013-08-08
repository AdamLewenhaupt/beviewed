createCommunity = ($scope) ->

	uploading = false

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
 
	$scope.tags = [
			"music",
			"games",
			"art",
			"comedy"
		]

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

	$scope.stepOne = (type) ->
		$scope.fields.type = type
		if $scope.validName() == "has-success"
			$scope.step = 2