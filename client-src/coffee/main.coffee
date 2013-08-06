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
				ng-src='{{user.image}}' /></a></div>"
		link: (scope) ->
			scope.user = scope.getUser()
		

app.directive "communityLocal", () ->
	restrict: 'A'
	replace: true
	scope:
		getCommunity: "&communityLocal"
	template: "
		<div><a href='/community/5200f3073fbe5c0c0b000001'>
			<img class='community img-rounded media-object' 
				ng-src='{{community.image}}'/></a></div>"
	link: (scope) ->
		scope.community = scope.getCommunity()