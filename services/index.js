var flow;

flow = require("./flow");

exports.io = flow.io;

exports.init = function(server) {
  var router;
  flow.init(server);
  return router = require("./service-router");
};
