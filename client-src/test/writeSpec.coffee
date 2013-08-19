describe "Write page tests", () ->

	describe "Creating", () ->

		it "Should create a object ready for the server", () ->

			scope =
				available: ["a", "b", "c"]
				$apply: () ->

			write = new writeCtrl scope, dummyHttp

			scope.setCommunity("a")

			expect(scope.community).toBe "a"