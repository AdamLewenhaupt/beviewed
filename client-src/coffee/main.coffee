app = angular.module 'beviewed', ["ui.bootstrap"]

app.directive "userLocal", () ->
		restrict: 'A'
		replace:true
		scope:
			getUser: "&userLocal"
		template: "
			<div>
			<a href='/profile'>
			<img class='user img-rounded' 
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
		<div><a href='/'>
			<img class='community img-rounded' 
				ng-src='{{community.image}}' 
				tooltip-append-to-body='true' 
				tooltip='{{community.name}}'/></a></div>"
	link: (scope) ->
		scope.community = scope.getCommunity()