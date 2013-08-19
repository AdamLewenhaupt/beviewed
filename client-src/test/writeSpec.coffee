describe "Write page tests", () ->

	describe "Creating", () ->

		it "Should create a object ready for the server", () ->

			scope =
				available: ["a", "b", "c"]
				$apply: () ->

			write = new writeCtrl scope, dummyHttp

			scope.setCommunity("a")

			expect(scope.community).toBe "a"

		it "Should extract the vital information", () ->

			scope = 
				$apply: () ->
				fields:
					media: "sc"
					mediaData: '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F104935880&amp;color=ff00d0&amp;auto_play=false&amp;show_artwork=true"></iframe>'

			write = new writeCtrl scope, dummyHttp
			#scope.extract()

			# expect(scope.extracted).toBe "https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F104935880&amp;color=ff00d0&amp;auto_play=false&amp;show_artwork=true"

