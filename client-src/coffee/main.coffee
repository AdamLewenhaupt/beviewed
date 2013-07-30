app = angular.module 'beviewed', ["ui.bootstrap"]

app.directive "userLocal", () ->
		restrict: 'A'
		replace:true
		scope:
			getUser: "&userLocal"
		template: "
			<div class='media'>
			<a href='/profile'>
			<img class='user img-rounded media-object' 
				ng-src='{{user.image}}' 
				tooltip-append-to-body='true' 
				tooltip='{{user.tag}}'/></a></div>"
		link: (scope) ->
			scope.user = scope.getUser()
		

app.directive "communityLocal", () ->
	restrict: 'A'
	replace: true
	scope:
		getCommunity: "&communityLocal"
	template: "
		<div><a href='/community'>
			<img class='community img-rounded media-object' 
				ng-src='{{community.image}}' 
				tooltip-append-to-body='true' 
				tooltip='{{community.name}}'/></a></div>"
	link: (scope) ->
		scope.community = scope.getCommunity()