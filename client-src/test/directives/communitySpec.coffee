describe "Community directive tests", () ->

	beforeEach () ->
		module "beviewed"

	it "Should saturate with valid id",  inject ($compile, $rootScope) ->

		el = undefined
		el2 = undefined

		scope1 = $rootScope.$new()
		scope2 = $rootScope.$new()

		scope1.id = "id"
		scope2.id = "id"


		el = $compile("<div community='id' />")(scope1)
		el2 = $compile("<div community='id' link='false' />")(scope2)

		scope1.$apply()
		scope2.$apply()

		expect(el.children("a").attr("href")).toBe "/community/id"
		expect(el2.children("a").attr("href")).toBe "#"