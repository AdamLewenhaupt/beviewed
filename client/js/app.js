var communityCtrl,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

communityCtrl = function($scope, $http, $sce, flow, stream, $window) {
  var sendMessage;
  stream.change($scope, "loadState");
  $scope.isLoading = function() {
    return $scope.loadState > 0;
  };
  $scope.chats = {};
  $scope.newName = "";
  $scope.feed = [];
  $scope.mainFeed = {
    media: "none"
  };
  $scope.capitalize = capitalize;
  $scope.current = 'what-up';
  $scope.inputSize = 1;
  $scope.error = function(msg) {
    return console.log(msg);
  };
  $scope.join = function() {
    var req;
    req = $http({
      method: "POST",
      url: "/join/" + $scope.community['_id']
    });
    return req.success(function(res) {
      if (res.error) {
        return $scope.error("Unable to join community");
      } else if (res.joined) {
        return $scope.memberType = "member";
      }
    });
  };
  $scope.renameCommunity = function() {
    var req;
    if ($scope.newName && $scope.newName.length > 8) {
      req = $http({
        method: "PUT",
        url: "/community/" + $scope.community['_id'],
        data: {
          name: $scope.newName
        }
      });
      req.error(function() {
        return $scope.error("Unable to update community name, please try again later.");
      });
      return req.success(function() {
        return $scope.community.name = $scope.newName.toLowerCase();
      });
    }
  };
  $scope.isMember = function() {
    if (!$scope.memberType) {
      return false;
    } else if ($scope.memberType === "admin" || $scope.memberType === "member") {
      return true;
    } else {
      return false;
    }
  };
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
    var data, i, id, req, room, _i, _len, _ref;
    data = $.parseJSON($scope.communityData);
    $scope.community = data.community;
    $scope.user = data.user;
    document.title = $scope.capitalize($scope.community.name);
    id = $scope.community['_id'];
    $scope.memberType = (function() {
      switch (false) {
        case __indexOf.call($scope.user["in"], id) < 0:
          return "member";
        case __indexOf.call($scope.user.admin, id) < 0:
          return "admin";
        default:
          return "visitor";
      }
    })();
    flow.init(["chat"], {
      rooms: $scope.community.roomDatas
    });
    $scope.removeRoomOptions = {};
    _ref = $scope.community.rooms;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      room = _ref[i];
      $scope.removeRoomOptions[room] = i;
    }
    $scope.community.roomDatas.forEach(function(room) {
      $scope.chats[room] = [];
      return flow.on("chat/update/" + room, function(entity) {
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
    $scope.newName = $scope.community.name;
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
  $scope.setRoom = function(n) {
    $scope.activeRoom = $scope.community.rooms[n];
    return $scope.activeRoomData = $scope.community.roomDatas[n];
  };
  $scope.addRoom = function(name) {
    return console.log(name);
  };
  return $scope.removeRoom = function(index) {
    return console.log(index);
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
    console.log("swipe");
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
    check1 = community.name.toLowerCase().indexOf($scope.mainQuery.toLowerCase()) !== -1;
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

profileCtrl = function($scope, $http) {
  $scope.setName = function(name) {
    var data, names, req;
    names = name.split(' ');
    data = {};
    data.firstName = names[0];
    if (names.length > 1) {
      data.lastName = names[1];
    }
    console.log(data);
    if (names.length > 0) {
      req = $http({
        method: "PUT",
        url: "/profile",
        data: data
      });
      return req.success(function() {
        $scope.user.firstName = data.firstName.toLowerCase();
        if (names.length > 1) {
          return $scope.user.lastName = data.lastName.toLowerCase();
        }
      });
    }
  };
  $scope.cap = capitalize;
  return $scope.signout = function() {
    return $http({
      method: "POST",
      url: "/signout"
    }).success(function(res) {
      if (res.error) {
        return console.log(res.error);
      } else {
        return window.location.replace("/");
      }
    });
  };
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
    $scope.fields.admins = [$scope.user['_id']];
    $scope.fields.userCount = 0;
    request = $http({
      method: "POST",
      url: "/create-community",
      data: $scope.fields
    });
    request.success(function(data) {
      return window.location.replace("/community/" + data.id);
    });
    return request.error(function(data) {
      return $scope.warn("Unable to create community");
    });
  };
};

var dashboardCtrl;

dashboardCtrl = function($scope, $http, flow, stream) {
  $scope.recent = false;
  $scope.loadState = 0;
  stream.change($scope, "loadState");
  $scope.isLoading = function() {
    return $scope.loadState > 0;
  };
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

var snapUp;

snapUp = function() {
  if ($("#content").css("margin-left") !== "250px") {
    if (window.snapper === void 0) {
      return window.snapper = new Snap({
        element: document.getElementById('content'),
        disable: "none",
        tapToClose: false
      });
    } else {
      return window.snapper.enable();
    }
  } else {
    window.snapper.close();
    return window.snapper.disable();
  }
};

if (window.Snap !== void 0) {
  $(function() {
    return $(window).resize(function() {
      return snapUp();
    });
  });
}

angular.module('beviewed', ["ng", "ngAnimate"]).config(function($sceDelegateProvider) {
  var soundCloudResource, youtubeResource;
  youtubeResource = /^\/\/www\.youtube\.com\/embed\/.*$/;
  soundCloudResource = /^https\:\/\/w\.soundcloud\.com\/player\/.*$/;
  return $sceDelegateProvider.resourceUrlWhitelist(["self", youtubeResource]);
}).directive("ifHandheld", function() {
  return {
    link: function(scope, el, attrs) {
      if (window.handHeld) {
        return el.addClass(attrs["desktop-only"]);
      }
    }
  };
}).directive("embeder", function($sce) {
  return {
    restrict: 'A',
    scope: {
      media: "=embeder",
      mediaData: "=embederSrc"
    },
    template: "<div ng-switch on='media'>        <iframe class='embed sc' ng-switch-when='sc' scrolling='no' frameborder='no' ng-src='{{soundCloud}}'></iframe>        <iframe class='embed yt' ng-switch-when='yt' ng-src='{{youTube}}' frameborder='no' allowfullscreen></iframe>        <div ng-switch-when='da' ng-bind-html='deviantArt'>        </div>      </div>",
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
}).directive("ssvParse", function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      return scope[attrs['ssvParse']] = JSON.parse(el.html());
    }
  };
}).directive("popup", function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      return el.on("click", function() {
        var calc, field, form, input, key, nvm, offset, options, parse, save, saveText, target, text, wrapper, x, y;
        saveText = attrs.text || "Save";
        options = scope[attrs.options];
        $(".popup").remove();
        offset = el.offset();
        x = offset.left + 10;
        y = offset.top - 20 - $(window).scrollTop();
        calc = $(window).width() < (x + 400) ? -320. : el.outerWidth(true);
        target = x + calc;
        wrapper = $("<div class='popup panel' style='z-index:6;position:fixed;left:" + target + "px;top:" + y + "px;width:300px;' />");
        form = $("<form class='form-inline' />");
        field = $("<div class='input-group popup-group' style='float:left;width:90%;'/>");
        input = (function() {
          if (options) {
            parse = "";
            for (key in options) {
              text = "<option value='" + options[key] + "'>" + key + "</option>";
              parse += text;
            }
            return $("<select class='form-control popup-input' style='width:70%;'>" + parse + "</select>");
          } else {
            return $("<input type='text' class='form-control popup-input' style='width:70%;' />");
          }
        })();
        save = $("<button class='input-group-addon btn btn-success popup-save' style='width:30%;'>" + saveText + "</button>");
        nvm = $("<button class='close popup-close' aria-hidden='true'>&times;</button>");
        save.on("click", function() {
          if (scope.$$phase) {
            (scope[attrs.popup] || function() {})(input.val());
          } else {
            scope.$apply(function() {
              return (scope[attrs.popup] || function() {})(input.val());
            });
          }
          wrapper.remove();
          return false;
        });
        nvm.on("click", function() {
          return wrapper.remove();
        });
        field.append(input, save);
        form.append(field);
        wrapper.append(form, nvm);
        return $(document.body).append(wrapper);
      });
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
    template: "    <div class='media'>      <a href='{{ genLink() }}'>        <img ng-click='delegate()' class='community img-rounded media-object'          ng-src='/img/icons/{{community}}' onerror='$(this).attr(\"src\",\"/img/unknown.png\")' />      </a></div>",
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
    template: "      <div class='media'>        <a href='/profile/{{user}}'>          <img class='user img-rounded media-object'            ng-src='/img/users/{{user}}' onerror='$(this).attr(\"src\",\"/img/unknown.png\")' /></a></div>",
    link: function(scope) {
      return scope.user = scope.getUser();
    }
  };
}).directive("hover", function() {
  return {
    restrict: 'A',
    link: function(scope, el, attrs) {
      el.on('mouseenter', function() {
        return el.addClass(attrs.hover);
      });
      return el.on('mouseleave', function() {
        return el.removeClass(attrs.hover);
      });
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
  socket = io.connect(window.location.hostname);
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
}).factory("stream", function() {
  var stream;
  stream = {
    listeners: [],
    count: 0,
    watch: function(fn) {
      fn();
      stream.count += 1;
      return stream.update();
    },
    done: function() {
      stream.count -= 1;
      return stream.update();
    },
    update: function() {
      var fn, _i, _len, _ref, _results;
      _ref = stream.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        fn = _ref[_i];
        _results.push(fn(stream.count));
      }
      return _results;
    },
    change: function(scope, name) {
      var update;
      update = function(n) {
        return scope[name] = n;
      };
      return stream.listeners.push(function(n) {
        if (scope.$$phase) {
          return update(n);
        } else {
          return scope.$apply(function() {
            return update(n);
          });
        }
      });
    }
  };
  return stream;
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
