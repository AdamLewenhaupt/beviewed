describe("Create Community Page tests", function() {
  return it("should warn if below 8 characters name and deny forward", function() {
    var anotherScope, ctrl, ctrl2, scope;
    scope = {
      fields: {
        name: "Test"
      }
    };
    ctrl = new createCommunity(scope, dummyHttp);
    scope.stepOne("reviewer");
    expect(scope.warnings.length).toBe(1);
    expect(scope.maxStep).toBe(1);
    anotherScope = {
      fields: {
        name: "A long enough name"
      }
    };
    ctrl2 = new createCommunity(anotherScope, dummyHttp);
    anotherScope.stepOne("creative");
    expect(anotherScope.warnings.length).toBe(0);
    return expect(anotherScope.maxStep).toBe(2);
  });
});

describe("Community directive tests", function() {
  beforeEach(function() {
    return module("beviewed");
  });
  return it("Should saturate with valid id", inject(function($compile, $rootScope) {
    var el, el2, scope1, scope2;
    el = void 0;
    el2 = void 0;
    scope1 = $rootScope.$new();
    scope2 = $rootScope.$new();
    scope1.id = "id";
    scope2.id = "id";
    el = $compile("<div community='id' />")(scope1);
    el2 = $compile("<div community='id' link='false' />")(scope2);
    scope1.$apply();
    scope2.$apply();
    expect(el.children("a").attr("href")).toBe("/community/id");
    return expect(el2.children("a").attr("href")).toBe("#");
  }));
});

describe("SSV directive test", function() {
  beforeEach(module('beviewed'));
  return it("Should retrive the data", inject(function($compile, $rootScope) {
    var scope;
    scope = $rootScope.$new();
    $compile("<div ssv='user'>bob</div>")(scope);
    return expect(scope.user).toBe("bob");
  }));
});

var dummyHttp;

dummyHttp = function() {
  return {
    success: function() {},
    error: function() {}
  };
};

describe("Explore page tests", function() {
  return describe("Filtering", function() {
    it("Art tag should filter out invalid tags", function() {
      var explore, scope;
      scope = {
        mainQuery: ""
      };
      explore = new exploreCtrl(scope, dummyHttp);
      scope.selectedTags.push('music');
      expect(scope.displayCommunity({
        tags: ['music'],
        name: "Aventry fan club"
      })).toBe(true);
      return expect(scope.displayCommunity({
        tags: ['art'],
        name: "Ducker"
      })).toBe(false);
    });
    return it("Main query should filter invalid names", function() {
      var explore, scope;
      scope = {
        mainQuery: "duck"
      };
      explore = new exploreCtrl(scope, dummyHttp);
      expect(scope.displayCommunity({
        tags: [],
        name: "Aventry fan club"
      })).toBe(false);
      return expect(scope.displayCommunity({
        tags: [],
        name: "dr ducks awesome club"
      })).toBe(true);
    });
  });
});

describe("Write page tests", function() {
  return describe("Creating", function() {
    it("Should create a object ready for the server", function() {
      var scope, write;
      scope = {
        available: ["a", "b", "c"],
        $apply: function() {}
      };
      write = new writeCtrl(scope, dummyHttp);
      scope.setCommunity("a");
      return expect(scope.community).toBe("a");
    });
    return it("Should extract the vital information", function() {
      var scope, write;
      scope = {
        $apply: function() {},
        fields: {
          media: "sc",
          mediaData: '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F104935880&amp;color=ff00d0&amp;auto_play=false&amp;show_artwork=true"></iframe>'
        }
      };
      return write = new writeCtrl(scope, dummyHttp);
    });
  });
});
