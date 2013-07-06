var communityNavCtrl, getTime;

getTime = function() {
  var d;
  d = new Date();
  return "" + (d.getHours()) + ":" + (d.getMinutes());
};

communityNavCtrl = function($scope, $element) {
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
      $(this).parent().submit();
      return false;
    }
  });
  $scope.sendMessage = function() {
    $scope.chatlog.push({
      user: "Me",
      content: $scope.messageText,
      time: getTime()
    });
    return $scope.messageText = "";
  };
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
