var communityCtrl, getTime, profileCtrl;

getTime = function() {
  var d;
  d = new Date();
  return "" + (d.getHours()) + ":" + (d.getMinutes());
};

profileCtrl = function($scope) {
  $scope.user = {
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
  };
  return $scope.admin = true;
};

communityCtrl = function($scope) {
  var sendMessage;
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
  $scope.current = 'social';
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
  return $scope.set = function(name) {
    console.log($element.children("ul li"));
    return console.log(name);
  };
};

var app;

app = angular.module('beviewed', ["ui.bootstrap"]);

app.directive("userLocal", function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      getUser: "&userLocal"
    },
    template: "			<div class='media'>			<a href='/profile'>			<img class='user img-rounded media-object' 				ng-src='{{user.image}}' 				tooltip-append-to-body='true' 				tooltip='{{user.tag}}'/></a></div>",
    link: function(scope) {
      return scope.user = scope.getUser();
    }
  };
});

app.directive("communityLocal", function() {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      getCommunity: "&communityLocal"
    },
    template: "		<div><a href='/community'>			<img class='community img-rounded media-object' 				ng-src='{{community.image}}' 				tooltip-append-to-body='true' 				tooltip='{{community.name}}'/></a></div>",
    link: function(scope) {
      return scope.community = scope.getCommunity();
    }
  };
});
