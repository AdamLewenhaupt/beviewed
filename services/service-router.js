var flow, services;

flow = require("./flow");

services = {
  "feed": require("./feed"),
  "chat": require("./chat")
};

flow.io.sockets.on("connection", function(socket) {
  return socket.on("init", function(data) {
    var type, _i, _len, _ref, _results;
    _ref = data.types;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      type = _ref[_i];
      _results.push(services[type](socket, data.data));
    }
    return _results;
  });
});
