var communityCtrl;

communityCtrl = function($scope) {
  var sendMessage;
  $(function() {
    return $scope.$apply(function() {
      $scope.community = $.parseJSON($(".community-data").html());
      return $scope.activeRoom = $scope.community.rooms[0];
    });
  });
  sendMessage = function() {
    $scope.chatlog.push({
      user: "Me",
      content: $scope.messageText,
      time: getTime()
    });
    $scope.messageText = "";
    return $(".chat-window-wrapper").animate({
      scrollTop: $(".chat-window").height(),
      duration: 50,
      queue: false
    });
  };
  $scope.capitalize = capitalize;
  $scope.hosts = [
    {
      image: "/img/dummy.jpg",
      tag: "spinnster",
      email: "adam.lewenhauptt@gmail.com",
      country: "sweden",
      firstName: "adam",
      lastName: "lewenhaupt",
      communities: [
        {
          name: "Aventry fan club",
          image: "/img/dummy2.jpeg"
        }
      ]
    }
  ];
  $scope.current = 'what-up';
  $scope.inputSize = 1;
  $scope.chatlog = [
    {
      user: "Me",
      content: "Hello world",
      time: "16:25"
    }, {
      user: "Tomten",
      content: "No",
      time: "16:40"
    }
  ];
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
  return $scope.setRoom = function(room) {
    return $scope.activeRoom = room;
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
    check2 = false;
    if ($scope.selectedTags.length > 0) {
      _ref = community.tags;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tag = _ref[_i];
        if (__indexOf.call($scope.selectedTags, tag) >= 0) {
          check2 = true;
          break;
        }
      }
    } else {
      check2 = true;
    }
    return check1 && check2;
  };
};

profileCtrl = function($scope) {
  return $(function() {
    return $scope.$apply(function() {
      return $scope.user = $.parseJSON($(".user-data").html());
    });
  });
};

var createCommunity,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

createCommunity = function($scope, $http) {
  var max, uploading;
  uploading = false;
  $scope.maxStep = 1;
  $scope.capitalize = capitalize;
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
  $scope.validName = function() {
    if ($scope.fields.name.length < 8) {
      return "has-error";
    } else {
      return "has-success";
    }
  };
  $scope.validDescription = function() {
    if ($scope.fields.description.length > 0 && $scope.fields.description.length <= 160) {
      return "";
    } else {
      return "has-error";
    }
  };
  $scope.stepOne = function(type) {
    $scope.fields.type = type;
    if ($scope.validName() === "has-success") {
      $scope.step = 2;
      return max(2);
    }
  };
  $scope.stepTwo = function(dataUrl) {
    if (dataUrl) {
      $scope.fields.icon = dataUrl;
      $scope.step = 3;
      return max(3);
    }
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

var app;

app = angular.module('beviewed', ["ui.bootstrap"]);

app.directive("community", function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      getCommunity: "&community"
    },
    template: "    <div class='media'>      <a href='/community/{{community}}'>        <img class='community img-rounded media-object'          ng-src='/img/icons/{{community}}' />      </a></div>",
    link: function(scope, el, attrs) {
      return scope.community = scope.getCommunity();
    }
  };
});

app.directive("user", function() {
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
});

app.directive("image", function($q) {
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
});

var capitalize;

capitalize = function(word) {
  if (word) {
    return word[0].toUpperCase() + word.slice(1);
  }
};
