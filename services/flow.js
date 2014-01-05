var socket;

socket = require('socket.io');

exports.init = function(server) {
  return exports.io = socket.listen(server, {
    log: false,
    gzip: true
  });
};
