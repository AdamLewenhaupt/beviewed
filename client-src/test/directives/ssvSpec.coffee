describe "SSV directive test", () ->

	beforeEach module 'beviewed'

	it "Should retrive the data", inject ($compile, $rootScope) ->
		scope = $rootScope.$new()

		$compile("<div ssv='user'>bob</div>")(scope)

		expect(scope.user).toBe("bob")
