var flow;

flow = require("./flow");

exports.init = function(server) {
  var router;
  flow.init(server);
  exports.io = flow.io;
  return router = require("./service-router");
};
