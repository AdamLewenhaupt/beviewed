dummyHttp = () ->
		success: () ->
		error: () ->

describe "Explore page tests", () ->

	describe "Filtering", () ->

		it "Art tag should filter out invalid tags", () ->

			scope =
				mainQuery: ""

			explore = new exploreCtrl scope, dummyHttp

			scope.selectedTags.push('music')

			expect(scope.displayCommunity
				tags: ['music']
				name: "Aventry fan club").toBe true

			expect(scope.displayCommunity
				tags: ['art']
				name: "Ducker").toBe false
	
		it "Main query should filter invalid names", () ->

			scope =
				mainQuery: "duck"

			explore = new exploreCtrl scope, dummyHttp

			expect(scope.displayCommunity
				tags: []
				name: "Aventry fan club").toBe false

			expect(scope.displayCommunity
				tags: []
				name: "dr ducks awesome club").toBe true