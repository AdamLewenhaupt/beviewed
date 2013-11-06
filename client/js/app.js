var communityCtrl;

communityCtrl = function($scope, $http, $sce, flow) {
  var sendMessage;
  $scope.chats = {};
  $scope.feed = [];
  $scope.mainFeed = {
    media: "none"
  };
  $scope.capitalize = capitalize;
  $scope.current = 'what-up';
  $scope.inputSize = 1;
  $scope.swipeRight = function() {
    return $(".side-nav").addClass("side-nav-hover");
  };
  $scope.swipeLeft = function() {
    return $(".side-nav").removeClass("side-nav-hover");
  };
  $scope.currentTab = function(name) {
    if (name === $scope.current) {
      return "btn-success";
    }
  };
  $scope.feedFilter = function(novelty) {
    return $scope.mainFeed["_id"] !== novelty["_id"];
  };
  $scope.setMainFeed = function(n) {
    $scope.mainFeed = $scope.feed[n];
    if ($scope.mainFeed.media === "sc") {
      return $scope.soundCloud = $sce.trustAsResourceUrl($scope.mainFeed.mediaData);
    } else if ($scope.mainFeed.media === "yt") {
      return $scope.youTube = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + $scope.mainFeed.mediaData);
    }
  };
  $scope.$watch("communityData", function() {
    var req;
    $scope.community = $.parseJSON($scope.communityData);
    flow.init(["chat"], {
      rooms: $scope.community.roomDatas
    });
    $scope.community.roomDatas.forEach(function(room) {
      $scope.chats[room] = [];
      return flow.on("chat/update/" + room, function(entity) {
        console.log(room, entity);
        return $scope.$apply(function() {
          $scope.chats[room].push(entity);
          return $(".chat-window-wrapper").animate({
            scrollTop: $(".chat-window").height(),
            duration: 50,
            queue: false
          });
        });
      });
    });
    $scope.setRoom(0);
    req = $http({
      method: "GET",
      url: "/api/feed/" + $scope.community['_id'] + "/" + $scope.community.type + "/0/10"
    });
    req.success(function(data) {
      $scope.feed = data;
      if ($scope.feed.length > 0) {
        return $scope.setMainFeed(0);
      }
    });
    return req.error(function(data) {
      return console.log(data);
    });
  });
  sendMessage = function() {
    flow.emit("chat/" + $scope.activeRoomData, {
      user: "spinno",
      msg: $scope.messageText,
      time: getTime()
    });
    $scope.chats[$scope.activeRoomData].push({
      user: "Me",
      msg: $scope.messageText
    });
    $scope.messageText = "";
    return $(".chat-window-wrapper").animate({
      scrollTop: $(".chat-window").height(),
      duration: 50,
      queue: false
    });
  };
  $(".chat form textarea").on('keypress', function(e) {
    if (e.keyCode === 13) {
      $scope.$apply(function() {
        return sendMessage();
      });
      return false;
    }
  });
  $scope.active = function(name) {
    if ($scope.current === name) {
      return "active";
    } else {
      return "";
    }
  };
  $scope.set = function(name) {
    console.log($element.children("ul li"));
    return console.log(name);
  };
  $scope.isCurrentRoom = function(room) {
    if ($scope.activeRoom === room) {
      return "active";
    } else {
      return "";
    }
  };
  return $scope.setRoom = function(n) {
    $scope.activeRoom = $scope.community.rooms[n];
    return $scope.activeRoomData = $scope.community.roomDatas[n];
  };
};

var exploreCtrl, getTime, profileCtrl,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

getTime = function() {
  var d;
  d = new Date();
  return "" + (d.getHours()) + ":" + (d.getMinutes());
};

exploreCtrl = function($scope, $http) {
  var req;
  $scope.searchType = "makers";
  $scope.swipeRight = function() {
    return $(".side-nav").addClass("side-nav-hover");
  };
  $scope.swipeLeft = function() {
    return $(".side-nav").removeClass("side-nav-hover");
  };
  $scope.currentType = function(name) {
    if (name === $scope.searchType) {
      return "btn-success";
    }
  };
  $scope.communities = [];
  req = $http({
    method: "GET",
    url: "/community-explore/init"
  });
  req.success(function(data) {
    return $scope.communities = data;
  });
  req.error(function(err) {
    return console.log(err);
  });
  $scope.tags = ["music", "games", "art", "comedy"];
  $scope.selectedTags = [];
  $scope.displayTag = function(tag) {
    return !(__indexOf.call($scope.selectedTags, tag) >= 0) && tag.indexOf($scope.tagSearch.toLowerCase()) !== -1;
  };
  return $scope.displayCommunity = function(community) {
    var check1, check2, tag, _i, _len, _ref;
    check1 = community.name.indexOf($scope.mainQuery.toLowerCase()) !== -1;
    check2 = true;
    if ($scope.selectedTags.length > 0) {
      _ref = $scope.selectedTags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        if (!(__indexOf.call(community.tags, tag) >= 0)) {
          check2 = false;
          break;
        }
      }
    }
    return check1 && check2;
  };
};

profileCtrl = function($scope) {
  $scope.cap = capitalize;
  return $(function() {
    return $scope.$apply(function() {
      return $scope.user = $.parseJSON($(".user-data").html());
    });
  });
};

var createCommunity,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

createCommunity = function($scope, $http) {
  var max, uploading, validators;
  uploading = false;
  $scope.maxStep = 1;
  $scope.capitalize = capitalize;
  $scope.warnings = [];
  max = function(nr) {
    if (nr > $scope.maxStep) {
      return $scope.maxStep = nr;
    }
  };
  $(function() {
    return $("#img-upload").change(function() {
      return $scope.$apply(function() {
        return uploading = true;
      });
    });
  });
  $scope.runUpload = function() {
    $scope.icon = {};
    uploading = false;
    return $("#img-upload").trigger('click');
  };
  $scope.isUploading = function() {
    if (uploading) {
      return "";
    } else {
      return "hide";
    }
  };
  $scope.isUploadingInverse = function() {
    if (uploading) {
      return "hide";
    } else {
      return "";
    }
  };
  $scope.tags = ["music", "games", "art", "comedy"];
  validators = {
    name: function() {
      return $scope.fields.name.length >= 8 && $scope.fields.name.length <= 26;
    },
    description: function() {
      return $scope.fields.description.length > 0 && $scope.fields.description.length <= 160;
    }
  };
  $scope.validate = function(name) {
    if (validators[name]()) {
      return "has-success";
    } else {
      return "";
    }
  };
  $scope.validateIcon = function(name) {
    if (validators[name]()) {
      return "glyphicon glyphicon-ok";
    } else {
      return "glyphicon glyphicon-remove";
    }
  };
  $scope.warn = function(msg) {
    return $scope.warnings.push(msg);
  };
  $scope.go = function(number) {
    return $scope.step = number;
  };
  $scope.current = function(num) {
    if (num === $scope.step) {
      return "btn-primary";
    } else {
      return "btn-info";
    }
  };
  $scope.displayTag = function(tag) {
    return !(__indexOf.call($scope.fields.tags, tag) >= 0) && tag.indexOf($scope.tagSearch) !== -1;
  };
  $scope.stepOne = function(type) {
    $scope.fields.type = type;
    if (validators["name"]()) {
      $scope.step = 2;
      return max(2);
    } else {
      $scope.warnings = [];
      return $scope.warn("Hold your horeses! That name is to short");
    }
  };
  $scope.stepTwo = function(dataUrl) {
    $scope.fields.icon = dataUrl || "no-icon";
    $scope.step = 3;
    return max(3);
  };
  return $scope.create = function() {
    var request;
    $scope.fields.admins = ['spinno'];
    $scope.fields.userCount = 0;
    request = $http({
      method: "POST",
      url: "/create-community",
      data: $scope.fields
    });
    request.sucess(function(data) {
      return alert("Success");
    });
    return request.error(function(data) {
      return alert("Error :(");
    });
  };
};

var dashboardCtrl;

dashboardCtrl = function($scope, $http, flow) {
  $scope.limit = limit;
  $scope["new"] = 0;
  return $scope.$watch('user', function() {
    var communities, req;
    $scope.userData = $.parseJSON($scope.user);
    communities = $scope.userData["in"].concat($scope.userData.admin);
    flow.init(["feed"], {
      communities: communities
    });
    req = $http({
      method: "GET",
      url: "/api/feed/multi/0/20?communities=" + (communities.join(' '))
    });
    req.success(function(data) {
      return $scope.feed = data;
    });
    req.error(function(data) {
      return console.log("Err", data);
    });
    return flow.on("community/update", function() {
      return $scope.$apply(function() {
        return $scope["new"]++;
      });
    });
  });
};

var indexCtrl;

indexCtrl = function($scope, $http) {
  var getLogin, getSignup;
  window.toggleLoad = function() {
    return $scope.$apply(function() {
      return $scope.isLoading = !$scope.isLoading;
    });
  };
  $scope.loginWidth = 46;
  $scope.signupWidth = 50;
  $scope.focus = false;
  $scope.isLoading = false;
  $scope.loginFields = {};
  $scope.signupFields = {};
  getLogin = function() {
    if (!($scope.loginFields.email && $scope.loginFields.pass)) {
      return false;
    }
    $scope.isLoading = true;
    return $http({
      method: "GET",
      url: "/login",
      params: {
        email: $scope.loginFields.email,
        pass: $scope.loginFields.pass
      }
    }).success(function(res) {
      $scope.isLoading = false;
      if (res.isValid) {
        return window.location.replace("/");
      } else {
        return $scope.error(res.error || "Something went wrong when loging in, please check your credientals");
      }
    }).error(function(err) {
      return $scope.isLoading = false;
    });
  };
  $scope.focusLogin = function() {
    $scope.loginWidth = 76;
    $scope.signupWidth = 20;
    return $scope.focus = "login";
  };
  $scope.focusSignup = function() {
    $scope.loginWidth = 20;
    $scope.signupWidth = 76;
    return $scope.focus = "signup";
  };
  $scope.error = function() {
    return console.log("err");
  };
  $scope.login = function() {
    if ($scope.$$phase) {
      return getLogin();
    } else {
      return $scope.$apply(function() {
        return getLogin();
      });
    }
  };
  getSignup = function() {
    if (!($scope.signupFields.email && $scope.signupFields.pass1 && $scope.signupFields.pass2)) {
      return false;
    }
    if ($scope.signupFields.pass1 !== $scope.signupFields.pass2) {
      $scope.error(res.error || "Your passwords don't match, please try again!");
      return;
    }
    console.log("all good");
    $scope.isLoading = true;
    return $http({
      method: "POST",
      url: "/signup",
      data: $scope.signupFields
    }).success(function(res) {
      $scope.isLoading = false;
      if (res.error) {
        return console.log(res.error);
      } else if (res === "reg") {
        return window.location.replace("/");
      }
    }).error(function(err) {
      return $scope.isLoading = false;
    });
  };
  return $scope.signup = function() {
    if ($scope.$$phase) {
      return getSignup();
    } else {
      return $scope.$apply(function() {
        return getSignup();
      });
    }
  };
};

angular.module('beviewed', ["ng", "ui.bootstrap", "ngAnimate", "ngTouch"]).config(function($sceDelegateProvider) {
  var soundCloudResource, youtubeResource;
  youtubeResource = /^\/\/www\.youtube\.com\/embed\/.*$/;
  soundCloudResource = /^https\:\/\/w\.soundcloud\.com\/player\/.*$/;
  return $sceDelegateProvider.resourceUrlWhitelist(["self", youtubeResource]);
}).directive("embeder", function($sce) {
  return {
    restrict: 'A',
    scope: {
      media: "=embeder",
      mediaData: "=embederSrc"
    },
    template: "<div  ng-switch on='media'>        <iframe class='embed sc' ng-switch-when='sc' scrolling='no' frameborder='no' ng-src='{{soundCloud}}'></iframe>        <iframe class='embed yt' ng-switch-when='yt' ng-src='{{youTube}}' frameborder='no' allowfullscreen></iframe>        <div ng-switch-when='da' ng-bind-html='deviantArt'>        </div>      </div>",
    link: function(scope, el, attrs) {
      var handleChange;
      handleChange = function() {
        if (scope.media === "sc") {
          return scope.soundCloud = $sce.trustAsResourceUrl(scope.mediaData);
        } else if (scope.media === "yt") {
          return scope.youTube = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + scope.mediaData);
        } else if (scope.media === "da") {
          return scope.deviantArt === ("<embed class='embed da' ng-switch-when='da' src='http://backend.deviantart.com/embed/view.swf?1' type='application/x-shockwave-flash' width='450' height='589' flashvars='id=" + scope.mediaData + "' allowscriptaccess='always'></embed>");
        }
      };
      scope.$watch("media", handleChange);
      scope.$watch("mediaData", handleChange);
      return handleChange();
    }
  };
}).directive("ssv", function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      return scope[attrs.ssv] = el.html();
    }
  };
}).directive("community", function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      getCommunity: "&community",
      link: "=",
      click: "&ngClick"
    },
    template: "    <div class='media'>      <a href='{{ genLink() }}'>        <img ng-click='delegate()' class='community img-rounded media-object'          ng-src='/img/icons/{{community}}' />      </a></div>",
    link: function(scope, el, attrs) {
      scope.community = scope.getCommunity();
      scope.doLink = scope.link;
      if (scope.doLink === void 0) {
        scope.doLink = true;
      }
      scope.delegate = function() {
        if (!scope.doLink) {
          return scope.click();
        }
      };
      return scope.genLink = function() {
        if (scope.doLink) {
          return "/community/" + scope.community;
        } else {
          return "#";
        }
      };
    }
  };
}).directive("sub", function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      return el.on("keydown", function(e) {
        e = e || window.event;
        if (e.keyCode === 13) {
          scope[attrs.sub]();
          return false;
        }
      });
    }
  };
}).directive("user", function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      getUser: "&user"
    },
    template: "      <div class='media'>        <a href='/profile/{{user}}'>          <img class='user img-rounded media-object'            ng-src='/img/users/{{user}}' /></a></div>",
    link: function(scope) {
      return scope.user = scope.getUser();
    }
  };
}).directive("image", function($q) {
  var URL, createImage, fileToDataURL, getResizeArea, postLink, resizeImage;
  URL = window.URL || window.webkitURL;
  getResizeArea = function() {
    var resizeArea, resizeAreaId;
    resizeAreaId = "fileupload-resize-area";
    resizeArea = document.getElementById(resizeAreaId);
    if (!resizeArea) {
      resizeArea = document.createElement("canvas");
      resizeArea.id = resizeAreaId;
      resizeArea.style.visibility = "hidden";
      document.body.appendChild(resizeArea);
    }
    return resizeArea;
  };
  resizeImage = function(origImage, options) {
    var canvas, ctx, height, maxHeight, maxWidth, quality, type, width;
    maxHeight = options.resizeMaxHeight || 300;
    maxWidth = options.resizeMaxWidth || 250;
    quality = options.resizeQuality || 0.7;
    type = options.resizeType || "image/jpg";
    canvas = getResizeArea();
    height = origImage.height;
    width = origImage.width;
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round(height *= maxWidth / width);
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width = Math.round(width *= maxHeight / height);
        height = maxHeight;
      }
    }
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(origImage, 0, 0, width, height);
    return canvas.toDataURL(type, quality);
  };
  createImage = function(url, callback) {
    var image;
    image = new Image();
    image.onload = function() {
      return callback(image);
    };
    return image.src = url;
  };
  fileToDataURL = function(file) {
    var deferred, reader;
    deferred = $q.defer();
    reader = new FileReader();
    reader.onload = function(e) {
      return deferred.resolve(e.target.result);
    };
    reader.readAsDataURL(file);
    return deferred.promise;
  };
  return {
    restrict: "A",
    scope: {
      image: "=",
      resizeMaxHeight: "@",
      resizeMaxWidth: "@",
      resizeQuality: "@",
      resizeType: "@"
    },
    link: postLink = function(scope, element, attrs, ctrl) {
      var applyScope, doResizing;
      doResizing = function(imageResult, callback) {
        return createImage(imageResult.url, function(image) {
          var dataURL;
          dataURL = resizeImage(image, scope);
          imageResult.resized = {
            dataURL: dataURL,
            type: dataURL.match(/:(.+\/.+);/)[1]
          };
          return callback(imageResult);
        });
      };
      applyScope = function(imageResult) {
        return scope.$apply(function() {
          if (attrs.multiple) {
            return scope.image.push(imageResult);
          } else {
            return scope.image = imageResult;
          }
        });
      };
      return element.bind("change", function(evt) {
        var files, i, imageResult, _results;
        if (attrs.multiple) {
          scope.image = [];
        }
        files = evt.target.files;
        i = 0;
        _results = [];
        while (i < files.length) {
          imageResult = {
            file: files[i],
            url: URL.createObjectURL(files[i])
          };
          fileToDataURL(files[i]).then(function(dataURL) {
            return imageResult.dataURL = dataURL;
          });
          if (scope.resizeMaxHeight || scope.resizeMaxWidth) {
            doResizing(imageResult, function(imageResult) {
              return applyScope(imageResult);
            });
          } else {
            applyScope(imageResult);
          }
          _results.push(i++);
        }
        return _results;
      });
    }
  };
}).factory("flow", function() {
  var flow, socket;
  socket = io.connect("http://localhost");
  flow = {
    init: function(types, data) {
      return socket.emit("init", {
        types: types,
        data: data
      });
    },
    on: function(name, fn) {
      return socket.on(name, fn);
    },
    emit: function(name, data) {
      return socket.emit(name, data);
    }
  };
  return flow;
});

var capitalize, limit;

capitalize = function(word) {
  if (word) {
    return word[0].toUpperCase() + word.slice(1);
  }
};

limit = function(word, n) {
  if (word.length > n) {
    return word.substr(0, n) + "...";
  } else {
    return word;
  }
};

var writeCtrl;

writeCtrl = function($scope, $http, $sce) {
  var regex, validators, warn;
  $scope.fields = {
    title: "",
    media: "none",
    mediaData: "",
    text: ""
  };
  regex = {
    extractors: {
      sc: /(.*)src\=\"([^\"]+)(.*)/gi,
      yt: /(.+)\/watch\?v=(.+)/gi
    }
  };
  $scope.warnings = [];
  warn = function(msg, type) {
    return $scope.warnings.push({
      msg: msg,
      type: type || ""
    });
  };
  validators = {
    title: function() {
      return $scope.fields.title.length >= 4 && $scope.fields.title.length <= 26;
    },
    mediaData: function() {
      if ($scope.fields.media === "none") {
        return false;
      } else {
        return validators[$scope.fields.media]();
      }
    },
    sc: function() {
      return $scope.fields.mediaData.match(regex.extractors.sc);
    },
    yt: function() {
      return $scope.fields.mediaData.match(regex.extractors.yt);
    },
    da: function() {
      return $scope.fields.mediaData.match(/\d+/) && $scope.fields.mediaData.length > 0;
    },
    text: function() {
      return $scope.fields.text.length > 0 && $scope.fields.text.length <= 320;
    }
  };
  $scope.validate = function(name) {
    if (validators[name]()) {
      return "has-success";
    } else {
      return "has-info";
    }
  };
  $scope.validateIcon = function(name) {
    if (validators[name]()) {
      return "glyphicon glyphicon-ok";
    } else {
      return "glyphicon glyphicon-remove";
    }
  };
  $scope.ready = function() {
    if (validators["title"]() && validators["mediaData"]() && validators["text"]()) {
      return "btn-success";
    } else {
      return "btn-primary";
    }
  };
  $scope.save = function() {
    var count, req;
    $scope.warnings = [];
    count = 0;
    if (validators["title"]()) {
      count += 1;
    } else {
      warn("Looks like there is something wrong with your title");
    }
    if (validators["mediaData"]()) {
      count += 1;
    } else {
      warn("Woopsie daisy! Please recheck the media field");
    }
    if (validators["text"]()) {
      count += 1;
    } else {
      warn("Don't try to trick us! Recheck your description please");
    }
    if (count === 3) {
      req = $http({
        method: "POST",
        url: "/new-feed/" + $scope.community,
        data: {
          fields: {
            title: $scope.fields.title,
            media: $scope.fields.media,
            text: $scope.fields.text,
            mediaData: $scope.extracted
          }
        }
      });
      req.success(function(data) {
        return warn("Awesome! Successfully posted", "alert-success");
      });
      return req.error(function(data) {
        if (data === "404-type") {
          return warn("Your community is not of the type that you are submiting a feed for");
        } else {
          return warn("Oh no! Looks like there was a problem, please check your internet connection");
        }
      });
    }
  };
  $scope.capitalize = capitalize;
  $(function() {
    return $scope.$apply(function() {
      $scope.available = $.parseJSON($(".data").html());
      if ($scope.available.length === 1) {
        return $scope.setCommunity($scope.available[0]);
      }
    });
  });
  $scope.setCommunity = function(community) {
    var req;
    $scope.community = community;
    req = $http({
      url: "/api/community/" + community,
      method: "GET"
    });
    req.success(function(data) {
      return $scope.communityData = data;
    });
    return req.error(function(err) {
      return $scope.error = err;
    });
  };
  $scope.isCreator = function() {
    return ($scope.communityData || {}).type === "creative";
  };
  $scope.media = function(name) {
    $scope.extracted = "";
    $scope.fields.mediaData = "";
    return $scope.fields.media = name;
  };
  $scope.extract = function() {
    $scope.extracted = (function() {
      switch ($scope.fields.media) {
        case "sc":
          return $scope.fields.mediaData.replace(regex.extractors.sc, "$2");
        case "yt":
          return $scope.fields.mediaData.replace(regex.extractors.yt, "$2");
        case "da":
          return $scope.fields.mediaData;
      }
    })();
    $scope.soundCloud = $sce.trustAsResourceUrl($scope.extracted);
    $scope.youTube = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + $scope.extracted);
    return $scope.deviantArt = $sce.trustAsHtml("<embed class='embed' ng-switch-when='da' src='http://backend.deviantart.com/embed/view.swf?1' type='application/x-shockwave-flash' width='450' height='589' flashvars='id=" + $scope.extracted + "' allowscriptaccess='always'></embed>");
  };
  return $scope.mediaType = function(name) {
    return $scope.fields.media === name;
  };
};
