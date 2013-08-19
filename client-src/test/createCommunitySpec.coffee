describe "Create Community Page tests", () ->

	it "should warn if below 8 characters name and deny forward", () ->

		scope = 
			fields:
				name: "Test"

		ctrl = new createCommunity scope, dummyHttp

		scope.stepOne("reviewer")

		expect(scope.warnings.length).toBe(1)
		expect(scope.maxStep).toBe(1)

		anotherScope = 
			fields:
				name: "A long enough name"

		ctrl2 = new createCommunity anotherScope, dummyHttp

		anotherScope.stepOne("creative")

		expect(anotherScope.warnings.length).toBe(0)
		expect(anotherScope.maxStep).toBe(2)